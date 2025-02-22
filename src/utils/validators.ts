export const validators = {
  required: (val: string) => !!val || 'Campo obrigatório',

  email: (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido',

  cpf: (val: string) => {
    const cpf = val.replace(/\D/g, '')
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return 'CPF inválido'

    const calcDigit = (slice: string) => {
      const numbers = slice.split('').map(Number)
      const modulus = numbers.length + 1
      const sum = numbers.reduce((acc, num, i) => acc + (num * (modulus - i)), 0)
      return (sum % 11) < 2 ? 0 : 11 - (sum % 11)
    }

    const firstNine = cpf.slice(0, 9)
    const firstDigit = calcDigit(firstNine)
    const secondDigit = calcDigit(firstNine + firstDigit)

    return cpf === firstNine + firstDigit + secondDigit || 'CPF inválido'
  },

  phone: (val: string) =>
    val.replace(/\D/g, '').length === 11 || 'Telefone inválido',

  password: (val: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val) ||
    'Mínimo 8 caracteres com letras e números',

  date: (val: string) =>
    /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Data inválida'
}
