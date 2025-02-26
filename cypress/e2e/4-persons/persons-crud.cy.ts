describe('Persons CRUD', () => {
  const newPerson = {
    nome: 'João Silva',
    cpf: '12345678909',
    endereco: {
      cep: '01001000',
      logradouro: 'Praça da Sé',
      numero: '100',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil'
    }
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/pessoas')
  })

  it('should create new person', () => {
    cy.get('button').contains('Nova Pessoa').click()

    // Preenche formulário
    cy.get('input[aria-label="Nome completo"]').type(newPerson.nome)
    cy.get('input[aria-label="CPF"]').type(newPerson.cpf)

    // Endereço
    cy.get('input[aria-label="CEP"]').type(newPerson.endereco.cep)
    cy.get('input[aria-label="Logradouro"]').type(newPerson.endereco.logradouro)
    cy.get('input[aria-label="Número"]').type(newPerson.endereco.numero)
    cy.get('input[aria-label="Bairro"]').type(newPerson.endereco.bairro)
    cy.get('input[aria-label="Cidade"]').type(newPerson.endereco.cidade)
    cy.get('input[aria-label="Estado"]').type(newPerson.endereco.estado)
    cy.get('input[aria-label="País"]').type(newPerson.endereco.pais)

    cy.contains('Salvar').click()
    cy.contains('Registro salvo com sucesso').should('exist')

    // Verifica na tabela
    cy.get('table tbody tr').should('contain', newPerson.nome)
  })

  it('should edit existing person', () => {
    cy.get('table tbody tr').first().find('button[aria-label="Editar"]').click()

    const updatedName = 'João Silva Atualizado'
    cy.get('input[aria-label="Nome completo"]').clear().type(updatedName)
    cy.get('input[aria-label="Número"]').clear().type('200')

    cy.contains('Salvar').click()
    cy.contains('Registro atualizado com sucesso').should('exist')
    cy.get('table tbody tr').should('contain', updatedName)
  })

  it('should delete person', () => {
    cy.get('table tbody tr').first().find('button[aria-label="Excluir"]').click()
    cy.contains('Confirmar exclusão').should('be.visible')
    cy.contains('button', 'Confirmar').click()
    cy.contains('Registro excluído com sucesso').should('exist')
  })

  it('should validate required fields', () => {
    cy.get('button').contains('Nova Pessoa').click()
    cy.contains('Salvar').click()

    // Verifica mensagens de erro
    cy.contains('Campo obrigatório').should('have.length.at.least', 7)
  })

  it('should upload profile photo', () => {
    cy.get('table tbody tr').first().find('button[aria-label="Upload Foto"]').click()

    cy.get('input[type="file"]').selectFile('cypress/fixtures/profile.jpg', { force: true })
    cy.contains('Enviar').click()

    cy.contains('Foto atualizada com sucesso').should('exist')
    cy.get('q-avatar img').should('have.attr', 'src').and('include', 'profile.jpg')
  })
})
