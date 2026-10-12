#!/bin/bash

# ============================================
# Script para iniciar Angular + Java (backend)
# Com tratamento de erros
# ============================================

set -o pipefail   # não use -e nem -u, pois queremos controlar os erros manualmente

# ============================================
# Garante node/npm no PATH (carrega nvm se necessário)
# ============================================
if ! command -v node >/dev/null 2>&1; then
    NVM_CANDIDATES=(
        "${NVM_DIR:-}"
        "$HOME/.nvm"
        "${SUDO_USER:+/home/$SUDO_USER/.nvm}"
    )
    for dir in "${NVM_CANDIDATES[@]}"; do
        [ -n "$dir" ] && [ -s "$dir/nvm.sh" ] || continue
        export NVM_DIR="$dir"
        # shellcheck disable=SC1091
        . "$NVM_DIR/nvm.sh"
        nvm use default >/dev/null 2>&1 || nvm use --lts >/dev/null 2>&1 || true
        break
    done
fi

# Diretórios
BASE_DIR="/var/www/imgconverter"
FRONTEND_DIR="$BASE_DIR/image-converter-frontend"
BACKEND_DIR="$BASE_DIR"
BACKEND_LOG="$BASE_DIR/backend.log"
FRONTEND_LOG="$BASE_DIR/frontend.log"

# Portas esperadas
BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# PIDs
FRONTEND_PID=""
BACKEND_PID=""

# ============================================
# Funções auxiliares
# ============================================
log_info()  { echo -e "${BLUE}ℹ ${NC}$*"; }
log_ok()    { echo -e "${GREEN}✔ ${NC}$*"; }
log_warn()  { echo -e "${YELLOW}⚠ ${NC}$*"; }
log_error() { echo -e "${RED}✖ ${NC}$*" >&2; }

die() {
    log_error "$*"
    cleanup
    exit 1
}

cleanup() {
    echo ""
    log_warn "Encerrando servidores..."
    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
    [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
    pkill -P "$FRONTEND_PID" 2>/dev/null
    pkill -P "$BACKEND_PID" 2>/dev/null
    log_error "Servidores encerrados."
}

trap cleanup SIGINT SIGTERM

# ============================================
# Verificações iniciais
# ============================================
check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

port_in_use() {
    local port="$1"
    if command -v ss >/dev/null 2>&1; then
        ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port"
    elif command -v lsof >/dev/null 2>&1; then
        lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    else
        # fallback sem ferramenta: tenta conectar
        (echo > "/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1
    fi
}

# ============================================
# 0. Validações de ambiente
# ============================================
log_info "Validando ambiente..."

if [ ! -d "$BASE_DIR" ]; then
    die "Diretório base não encontrado: $BASE_DIR"
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    die "Diretório do frontend não encontrado: $FRONTEND_DIR"
fi

if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    die "package.json não encontrado em $FRONTEND_DIR (projeto Angular inválido?)"
fi

if ! check_command node; then
    log_error "Node.js não encontrado no PATH."
    log_error "PATH atual: $PATH"
    log_error "Dica: rode o script como seu usuário (sem sudo) ou instale o Node via nvm."
    die "Node.js ausente."
fi

if ! check_command npm; then
    die "npm não está instalado ou não está no PATH."
fi

if ! check_command java; then
    die "Java não está instalado ou não está no PATH. Rode: sudo apt install default-jdk"
fi

# ============================================
# 1. Detecta como iniciar o backend
# ============================================
BACKEND_CMD=""
BACKEND_TYPE=""

if [ -f "$BACKEND_DIR/pom.xml" ]; then
    if ! check_command mvn; then
        die "Maven não instalado (necessário para pom.xml). Rode: sudo apt install maven"
    fi
    BACKEND_TYPE="maven"
    BACKEND_CMD="mvn spring-boot:run"
elif [ -f "$BACKEND_DIR/build.gradle" ] || [ -f "$BACKEND_DIR/build.gradle.kts" ]; then
    if [ ! -x "$BACKEND_DIR/gradlew" ]; then
        die "gradlew não encontrado ou sem permissão de execução em $BACKEND_DIR. Rode: chmod +x gradlew"
    fi
    BACKEND_TYPE="gradle"
    BACKEND_CMD="./gradlew bootRun"
elif ls "$BACKEND_DIR"/*.jar >/dev/null 2>&1; then
    JAR_FILE=$(ls -t "$BACKEND_DIR"/*.jar | head -n 1)
    BACKEND_TYPE="jar"
    BACKEND_CMD="java -jar \"$JAR_FILE\""
else
    die "Backend não encontrado: nenhum pom.xml, build.gradle ou .jar em $BACKEND_DIR"
fi

log_ok "Backend detectado: $BACKEND_TYPE"

# ============================================
# 2. Checa portas em uso
# ============================================
if port_in_use "$BACKEND_PORT"; then
    die "Porta $BACKEND_PORT já está em uso. Encerre o processo ou defina BACKEND_PORT=xxxx ao rodar o script."
fi

if port_in_use "$FRONTEND_PORT"; then
    die "Porta $FRONTEND_PORT já está em uso. Encerre o processo (ex: outro ng serve)."
fi

# ============================================
# 3. Inicia o backend
# ============================================
log_info "Iniciando backend ($BACKEND_TYPE)..."

: > "$BACKEND_LOG"   # limpa o log antigo
cd "$BACKEND_DIR" || die "Não foi possível entrar em $BACKEND_DIR"

eval "$BACKEND_CMD" > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    log_error "Falha ao iniciar o backend. Últimas linhas do log:"
    tail -n 30 "$BACKEND_LOG" >&2
    cleanup
    exit 1
fi

log_ok "Backend iniciado (PID: $BACKEND_PID) - log: $BACKEND_LOG"

# Espera o backend abrir a porta (até 60s)
log_info "Aguardando backend na porta $BACKEND_PORT..."
WAITED=0
BACKEND_READY=0
while [ "$WAITED" -lt 60 ]; do
    if port_in_use "$BACKEND_PORT"; then
        BACKEND_READY=1
        break
    fi
    # Se o processo morreu, não adianta esperar
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        log_error "Backend morreu durante a inicialização. Últimas linhas do log:"
        tail -n 40 "$BACKEND_LOG" >&2
        cleanup
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
done

if [ "$BACKEND_READY" -ne 1 ]; then
    log_error "Backend não abriu a porta $BACKEND_PORT em 60s. Últimas linhas do log:"
    tail -n 40 "$BACKEND_LOG" >&2
    cleanup
    exit 1
fi

log_ok "Backend pronto em http://localhost:$BACKEND_PORT"

# ============================================
# 4. Instala dependências do frontend se preciso
# ============================================
cd "$FRONTEND_DIR" || die "Não foi possível entrar em $FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    log_warn "node_modules ausente. Rodando npm install..."
    if ! npm install >> "$FRONTEND_LOG" 2>&1; then
        log_error "npm install falhou. Últimas linhas do log:"
        tail -n 40 "$FRONTEND_LOG" >&2
        cleanup
        exit 1
    fi
    log_ok "npm install concluído"
fi

# ============================================
# 5. Inicia o Angular
# ============================================
log_info "Iniciando Angular..."
: > "$FRONTEND_LOG"
npm start > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    log_error "Falha ao iniciar o Angular. Últimas linhas do log:"
    tail -n 30 "$FRONTEND_LOG" >&2
    cleanup
    exit 1
fi

log_ok "Angular iniciado (PID: $FRONTEND_PID) - log: $FRONTEND_LOG"

# Espera a porta 4200 abrir (até 90s)
log_info "Aguardando Angular na porta $FRONTEND_PORT..."
WAITED=0
FRONTEND_READY=0
while [ "$WAITED" -lt 90 ]; do
    if port_in_use "$FRONTEND_PORT"; then
        FRONTEND_READY=1
        break
    fi
    if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        log_error "Angular morreu durante a inicialização. Últimas linhas do log:"
        tail -n 40 "$FRONTEND_LOG" >&2
        cleanup
        exit 1
    fi
    sleep 2
    WAITED=$((WAITED + 2))
done

if [ "$FRONTEND_READY" -ne 1 ]; then
    log_error "Angular não abriu a porta $FRONTEND_PORT em 90s. Últimas linhas do log:"
    tail -n 40 "$FRONTEND_LOG" >&2
    cleanup
    exit 1
fi

# ============================================
# 6. Status final
# ============================================
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  ✔ Servidores rodando:${NC}"
echo -e "${GREEN}    ▶ Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}    ▶ Backend:  http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "${YELLOW}  Pressione Ctrl+C para encerrar tudo${NC}"
echo -e "${YELLOW}  Logs em tempo real:${NC}"
echo -e "${YELLOW}    tail -f $BACKEND_LOG${NC}"
echo -e "${YELLOW}    tail -f $FRONTEND_LOG${NC}"
echo ""

# Se qualquer processo morrer, o script percebe e encerra o outro
while true; do
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        log_error "Backend caiu inesperadamente. Veja $BACKEND_LOG"
        tail -n 20 "$BACKEND_LOG"
        cleanup
        exit 1
    fi
    if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        log_error "Frontend caiu inesperadamente. Veja $FRONTEND_LOG"
        tail -n 20 "$FRONTEND_LOG"
        cleanup
        exit 1
    fi
    sleep 3
done
