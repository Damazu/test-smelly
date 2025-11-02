const { UserService } = require('../src/userService');

const dadosUsuarioComum = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

const dadosUsuarioAdmin = {
  nome: 'Admin User',
  email: 'admin@teste.com',
  idade: 40,
  isAdmin: true,
};

describe('UserService - Suíte de Testes Limpa (Clean)', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  test('deve criar um novo usuário com sucesso', () => {
    // Arrange (Organizar)
    const { nome, email, idade } = dadosUsuarioComum;

    // Act (Agir)
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert (Verificar)
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
    expect(usuarioCriado.status).toBe('ativo');
    expect(usuarioCriado.isAdmin).toBe(false);
  });

  test('deve lançar um erro ao tentar criar um usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve lançar um erro ao tentar criar um usuário sem email', () => {
    // Arrange
    const { nome, idade } = dadosUsuarioComum;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, null, idade);
    }).toThrow('Nome, email e idade são obrigatórios.');
  });

  test('deve buscar um usuário existente pelo ID', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioComum;
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toBeDefined();
    expect(usuarioBuscado.id).toBe(usuarioCriado.id);
    expect(usuarioBuscado.nome).toBe(nome);
  });

  test('deve retornar null ao buscar um ID inexistente', () => {
    // Arrange
    const idInexistente = 'id-fake-123';

    // Act
    const usuarioBuscado = userService.getUserById(idInexistente);

    // Assert
    expect(usuarioBuscado).toBeNull();
  });
  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser(
      dadosUsuarioComum.nome,
      dadosUsuarioComum.email,
      dadosUsuarioComum.idade
    );

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser(
      dadosUsuarioAdmin.nome,
      dadosUsuarioAdmin.email,
      dadosUsuarioAdmin.idade,
      true 
    );

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo'); // Permanece 'ativo'
  });

  test('deve gerar um relatório contendo os usuários cadastrados', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).toContain(`ID: ${usuario1.id}, Nome: Alice, Status: ativo`);
    expect(relatorio).toContain(`ID: ${usuario2.id}, Nome: Bob, Status: ativo`);
  });

  test("deve gerar um relatório de 'Nenhum usuário' quando o banco está vazio", () => {
    // Arrange

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});