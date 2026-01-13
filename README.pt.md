<h1 align="center">
  <img src="frontend/public/logo-green.png" alt="Springular AI logo" width="40" style="vertical-align: middle; margin-right: 10px;">
  Springular AI
</h1>

<p align="center">
  🌎 <strong>Languages:</strong><br>
  <a href="README.pt.md">🇧🇷 Portuguese</a> |
  <a href="README.md">🇺🇸 English</a>
</p>

**Springular AI** é uma aplicação full-stack que demonstra como construir **experiências de chat com inteligência artificial** usando **Spring AI (Java)** no backend e **Angular** no frontend.

O projeto inclui:
- **Simple Chat** (interação sem estado com o LLM)
- **Memory Chat** (histórico de conversas persistido em banco de dados usando Spring AI Chat Memory)

O foco é em **arquitetura limpa**, **padrões modernos de Angular** e **aplicações práticas do Spring AI** com modelos OpenAI.

---

## 🏆 Motivação

Este projeto foi criado como parte de uma **jornada de aprendizado baseada na playlist Spring AI + Angular** da Loiane Groner:  
👉 https://github.com/loiane/spring-ai-angular

Além de praticar **desenvolvimento full-stack**, a motivação principal foi **curiosidade e exploração prática de como o Spring AI funciona em um cenário real**, especificamente:

- Entender como o **Spring AI consome a API da OpenAI**
- Construir uma **aplicação de chat real**, em vez de exemplos isolados
- Explorar **manipulação de prompts, fluxo de conversas e memória de chat**
- Integrar **Spring Boot (backend)** com **Angular (frontend)** de maneira limpa e moderna

Como estudante de Ciência da Computação, este projeto também ajudou a reforçar conceitos como:

- Projetar APIs REST para sistemas conversacionais  
- Gerenciar estado e histórico de conversas no backend  
- Criar uma UI de chat responsiva e reativa com Angular  
- Aplicar arquitetura limpa e separação de responsabilidades  

No geral, **Springular AI** serve tanto como projeto de estudo prático quanto como sandbox para experimentar **aplicações dirigidas por IA usando Spring AI e OpenAI** em um ambiente full-stack realista.

## 📸 Capturas de Tela

Abaixo estão algumas capturas de tela mostrando as principais funcionalidades do **Springular AI**.

### 🗨️ Simple Chat
Chat sem estado usando Spring AI e OpenAI.

![Simple Chat](frontend/public/simple-chat.png)

### 🧠 Memory Chat
O histórico de conversas é persistido usando Spring AI Chat Memory com MySQL.

![Memory Chat](frontend/public/memory-chat.png)

## 📚 Pontos de Aprendizado

Durante o desenvolvimento, os seguintes conceitos foram explorados e reforçados:

- **Backend**
  - Spring Boot 3
  - Spring AI (ChatClient, Advisors, Chat Memory)
  - Integração com OpenAI
  - Repositório de memória de chat baseado em JDBC
  - APIs RESTful
  - Camadas de serviço e repositório limpas
  - Docker Compose para infraestrutura local

- **Frontend**
  - Componentes standalone do Angular
  - Angular Signals e Effects
  - Angular Material UI
  - Recursos HTTP (`httpResource`)
  - Tratamento de erros e estratégias de retry
  - Padrões de UI para chat (auto-scroll, indicadores de digitação, validação)

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para executar tudo localmente.

### 📦 Pré-requisitos

Certifique-se de ter instalado:

- **Java 21+**
- **Node.js 18+**
- **Angular CLI**
- **Docker & Docker Compose**
- **Uma chave de API da OpenAI**

---

### 🔐 Variáveis de Ambiente

O backend requer uma chave de API da OpenAI.

Configure em seu ambiente:

```bash
export OPENAI_API_KEY=sua_chave_openai_aqui
```
Ou no Windows (PowerShell):
```powershell
$env:OPENAI_API_KEY="sua_chave_openai_aqui"
```
---

### 🐬 Banco de Dados (MySQL via Docker)
O projeto usa **MySQL** para persistência da memória de chat.

A partir da pasta `backend`, inicie o banco de dados:
```bash
docker compose up -d
```

Isso iniciará um container MySQL com:
- Banco de dados: `mydatabase`
- Usuário: `myuser`
- Senha: `secret`
- Porta: `3306`

⚠️ O schema não é **criado automaticamente**. As tabelas da memória de chat do Spring AI devem existir ou ser gerenciadas manualmente.

---

### 🧠 Backend (Spring Boot + Spring AI)

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Execute a aplicação:
```bash
./mvnw spring-boot:run
```

3. O backend iniciará em:
```bash
http://localhost:8080
```

4. Endpoints disponíveis:

 - Simple Chat
```bash
POST /api/chat
```

- Memory Chat
```http
GET    /api/chat-memory
GET    /api/chat-memory/{chatId}
POST   /api/chat-memory/start
POST   /api/chat-memory/{chatId}
```

Para mais informações, visite: [Documentação do Spring AI](https://docs.spring.io/spring-ai/reference/).

--- 

### 🖥️ Frontend (Angular)

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento Angular:
```bash
ng serve
```

4. O frontend estará disponível em:
```bash
http://localhost:4200
```

O frontend está configurado com um proxy para encaminhar requisições `/api/**` para o backend Spring Boot.


--- 

## 🧱 Arquitetura da Aplicação
| Camada         | Tecnologia              | Responsabilidade                                        |
| -------------- | ----------------------- | ------------------------------------------------------- |
| Frontend       | Angular + TypeScript    | UI do chat, roteamento, gerenciamento de estado         |
| Backend        | Spring Boot + Spring AI | Integração com LLM, gerenciamento de memória, APIs REST |
| Banco de Dados | MySQL                   | Persistência do histórico de chat                       |
| Modelo AI      | OpenAI                  | Respostas em linguagem natural                          |
| Infra          | Docker Compose          | Configuração do banco de dados local                    |


## 🧭 Fluxo da Aplicação
```text
Usuário
 ↓
Frontend Angular
 ↓
API REST do Spring Boot
 ↓
Spring AI ChatClient
 ↓
Modelo OpenAI
 ↓
Resposta retornada para a UI
```
- Para Memory Chat:
```text
Usuário
 ↓
Frontend Angular
 ↓
API REST do Spring Boot
 ↓
Spring AI ChatClient + ChatMemory
 ↓
MySQL (histórico de conversas)
 ↓
Modelo OpenAI
```

## 📂 Estrutura do Projeto
```bash
springular-ai/
├─ backend/
│  ├─ src/main/java/com/pitercoding/backend/
│  │  ├─ chat/                 # Chat sem estado
│  │  ├─ memory/               # Chat com memória
│  │  └─ BackendApplication.java
│  ├─ compose.yaml             # Container MySQL
│  ├─ pom.xml                  # Configuração Spring Boot + Spring AI
│  └─ application.properties
├─ frontend/
│  ├─ public/                  # Logos e assets estáticos
│  ├─ src/app/
│  │  ├─ chat/                 # UI Simple Chat & Memory Chat
│  │  ├─ shared/               # Pipes, logging, tratamento de erros
│  │  └─ app.routes.ts
│  ├─ proxy.conf.js             # Configuração do proxy da API
│  └─ angular.json
├─ README.md
├─ README.pt.md
└─ LICENSE
```

## 📜 **Licença**

Este projeto está sob a licença **MIT**. Sinta-se à vontade para usar, estudar e modificar.

## 🧑‍💻 Autor

**Piter Gomes** — Aluno de Ciências da Computação (6º Semestre) & Desenvolvedor Full-Stack

📧 [Email](mailto:piterg.bio@gmail.com) | 💼 [LinkedIn](https://www.linkedin.com/in/piter-gomes-4a39281a1/) | 💻 [GitHub](https://github.com/pitercoding) | 🌐 [Portfolio](https://portfolio-pitergomes.vercel.app/)
