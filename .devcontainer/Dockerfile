FROM ubuntu:rolling

RUN apt update && apt install -y bash git curl tar

WORKDIR /bin

RUN curl -sSL 'https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz' | tar -zxv

ENV ASDF_DATA_DIR="/var/asdf"
ENV PNPM_HOME="/var/pnpm"
ENV PATH="${ASDF_DATA_DIR}/shims:${PNPM_HOME}:$PATH"


RUN asdf plugin add nodejs \
 && asdf plugin add pnpm \
 && asdf plugin add devpod-cli \
 && asdf plugin add uv \
 && asdf install uv latest \
 && asdf set -u uv latest \
 && uv venv --system \
 && uv pip install omnara

WORKDIR /workspaces

ENTRYPOINT ["/bin/bash"]
