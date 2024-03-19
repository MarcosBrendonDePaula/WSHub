# WSHub
---

**Biblioteca de WebSocket Utilizada:** Socket.IO

---

**command:direct**

Descrição: Este comando permite o envio de mensagens diretas entre usuários conectados em salas.

Estrutura de Dados Necessária:
- data: Objeto JSON contendo os seguintes campos:
    - to: Nome de usuário do destinatário da mensagem.
    - content: Conteúdo da mensagem a ser enviado.

Funcionalidade:
- O servidor identifica o remetente da mensagem e procura o ID do socket do destinatário com base no nome de usuário (to).
- Se o destinatário estiver online, o servidor envia a mensagem diretamente para o socket correspondente.

**command:joinRoom**

Descrição: Este comando permite que um usuário entre em uma sala específica.

Estrutura de Dados Necessária:
- data: Objeto JSON contendo os seguintes campos:
    - id: ID da sala à qual o usuário deseja entrar.
    - password (opcional): Senha da sala, se aplicável.

Funcionalidade:
- O servidor verifica se o ID da sala está presente nos dados recebidos.
- Se a sala tiver uma senha, o servidor também verifica se a senha fornecida corresponde à senha da sala.
- Se a sala tiver um limite de conexões e esse limite for atingido, o servidor emite um erro.
- Se a senha não foi fornecida anteriormente, ela é salva para uso futuro.
- O servidor remove o socket da sala atual e o adiciona à nova sala.
- O servidor atualiza as informações da sala e emite um evento de entrada na sala para os participantes.
- O servidor atualiza globalmente as informações da sala.

**command:setData**

Descrição: Este comando permite atualizar os dados do usuário conectado em uma sala.

Estrutura de Dados Necessária:
- data: Objeto JSON contendo os dados a serem atualizados.

Funcionalidade:
- O servidor atualiza os dados do usuário conectado na sala especificada.
- O servidor emite um evento de atualização para os participantes da sala.

**command:setUserName**

Descrição: Este comando permite atualizar o nome de usuário do usuário conectado em uma sala.

Estrutura de Dados Necessária:
- data: Novo nome de usuário.

Funcionalidade:
- O servidor atualiza o nome de usuário do usuário conectado na sala especificada.
- O servidor emite um evento de atualização para os participantes da sala.

**command:roomUpdate**

Descrição: Este comando permite atualizar globalmente as informações de uma sala.

Estrutura de Dados Necessária:
- Nenhuma.

Funcionalidade:
- O servidor atualiza globalmente as informações da sala especificada.
- O servidor emite um evento de atualização global para todas as instâncias conectadas à sala.

**command:leaveRoom**

Descrição: Este comando permite que um usuário saia da sala atual.

Estrutura de Dados Necessária:
- Nenhuma.

Funcionalidade:
- O servidor remove o socket do usuário da sala atual.
- Se o usuário estava em uma sala válida, o servidor emite um evento de saída para os participantes da sala.
- O servidor retorna o usuário à sala padrão e emite um evento de entrada para os participantes da sala padrão.
- O servidor atualiza globalmente as informações da sala da qual o usuário saiu.

---
