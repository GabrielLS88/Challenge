# Use a imagem oficial do Node.js
FROM node:18

# Crie e defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código-fonte da aplicação
COPY . .

# Exponha a porta em que a aplicação será executada
EXPOSE 8888

# Comando para iniciar a aplicação
CMD ["node", "app.js"]

