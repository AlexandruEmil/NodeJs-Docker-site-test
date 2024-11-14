# Alegerea imaginii de bază
FROM node:14

# Setarea directorului de lucru
WORKDIR /app

# Instalarea SQLite și a altor utilitare necesare
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalarea pachetelor necesare
COPY package*.json ./
RUN npm install

# Copierea fișierelor aplicației
COPY . .

# Crearea directorului pentru încărcarea imaginilor
RUN mkdir uploads

# Expunerea portului 3000
EXPOSE 3000

# Comanda pentru a porni serverul
CMD ["node", "server.js"]
