# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos necessários para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos para o contêiner
COPY . .

RUN npm run build

# Exponha a porta utilizada pela sua aplicação
EXPOSE 3000

WORKDIR /usr/src/app

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["node", "./build/Server.js"]
