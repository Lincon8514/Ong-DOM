# 🍼 ONG DOM – Drops of Milk

### 🌸 Plataforma de apoio à doação de leite materno e voluntariado

O projeto **ONG DOM (Drops of Milk)** é uma aplicação web desenvolvida como parte de uma atividade acadêmica, com o objetivo de criar uma plataforma digital que conecte **doadores, voluntários e administradores de ONGs** de forma segura, transparente e acolhedora.

---

## 💖 Visão Geral

A ONG DOM tem como missão **promover o amor materno e o cuidado com a vida**, facilitando o processo de **doação de leite materno** e incentivando o **voluntariado social**.  
A plataforma foi desenvolvida com foco em **usabilidade, acessibilidade e responsividade**.

---

## 🧩 Funcionalidades Principais

### 👩‍👧 Página Inicial (`index.html`)
- Apresentação da ONG: missão, visão e valores.  
- Banners rotativos com mensagens sobre doação e solidariedade.  
- Layout responsivo (desktop, tablet e mobile).  
- Menu com botão de **Login**.

---

### 🔐 Login (`login.html`)
- Formulário centralizado de login.  
- Abaixo do botão **Entrar**, há o link **“Ainda não tem conta? Cadastre-se aqui.”**.  
- Sistema de login via **LocalStorage**:
  - **Admin:** `admin@dom.org` / `admin123`
  - **Usuários voluntários:** conforme cadastro realizado.

---

### 📝 Cadastro (`cadastro.html`)
- Formulário completo com validações de CPF, telefone, CEP, e-mail e senha.  
- Máscaras aplicadas para dados sensíveis.  
- Dados armazenados localmente com segurança (simulação via LocalStorage).

---

### 👑 Painel do Administrador (`profileAdm.html`)
- Exibe todos os usuários cadastrados na plataforma.  
- Mostra tipo de perfil (voluntário ou doador).  
- Mostra projetos aos quais os usuários estão vinculados.  
- Design em cards, responsivo e leve.

---

### 🙋 Perfil do Voluntário (`profileVoluntario.html`)
- Upload de **foto de perfil**.  
- Campo para **descrição pessoal**.  
- Seleção de papel: *Sou doador voluntário* ou *Recebo doações*.  
- Dados persistem no LocalStorage e podem ser atualizados.

---

### 🤝 Projetos (`projetos.html`)
- Lista de projetos sociais com descrição e imagem.  
- Botão “Quero ser voluntário” (vincula o usuário logado ao projeto).  
- Layout limpo e acessível.

---

## 🎨 Design e Tecnologias

| Tecnologia | Uso |
|-------------|------|
| **HTML5** | Estrutura semântica e acessível das páginas |
| **CSS3** | Estilos responsivos e tema rosa acolhedor |
| **JavaScript (ES6)** | Controle de banners, menus, login, perfis e LocalStorage |
| **LocalStorage** | Simulação de banco de dados local |
| **Responsividade** | Layout adaptável para todos os dispositivos |

---

## ⚙️ Como Executar Localmente

1. **Baixe ou clone** este repositório:
   ```bash
   git clone https://github.com/seuusuario/ong-dom.git
