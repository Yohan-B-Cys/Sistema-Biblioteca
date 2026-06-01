# 📚 Sistema Biblioteca

Sistema de gerenciamento de uma biblioteca completo que permite cadastrar, editar, excluir, listar e visualizar histórico de alterações dos livros feito com React.js no Front-end e Nest.js no Back end com Typeorm para integração do banco de dados Sqlite3.

---
## ℹ️  Preview
![Alternative Text](image_path.png)


## 🚀 Funcionalidades

- Cadastro de livros
- Edição de livros
- Exclusão com confirmação
- Listagem de livros
- Busca dinâmica (título, autor, ID e ano)
- Paginação
- Histórico de alterações por livro
- Tema claro/escuro (Dark Mode)
- Feedback visual com toast

---

## 🛠️ Tecnologias

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons

### Backend
- Node.js
- Sqlite3
- TypeORM

---

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

- **Frontend**: Interface do usuário construída em React  
- **Backend**: API REST em Nest responsável pelo gerenciamento dos dados  

O frontend se comunica com o backend via requisições HTTP.

---

## 📂 Estrutura do projeto

Sistema-Biblioteca/

├── backend/       
├── frontend/       
└── README.md


### Frontend


## 🌐 Rotas Frontend

| Rota | Descrição |
|------|----------|
| /books | Lista de livros |
| /books/new | Cadastro |
| /books/:id/edit | Edição |

---

## 📡 API

| Método | Rota | Descrição |
|--------|------|----------|
| GET | / | Listar livros |
| POST | / | Criar livro |
| PUT | /:id | Atualizar livro |
| DELETE | /:id | Excluir livro |
| GET | /history/:id | Histórico |

---

## ⚙️ Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/Yohan-B-Cys/Sistema-Biblioteca.git
cd Sistema-Biblioteca
