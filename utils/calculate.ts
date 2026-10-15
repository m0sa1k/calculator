interface CalculateProps {
  totalAmount: number; // Стоимость жилья
  downPayment: number; // Первоначальный взнос
  years: number;       // Срок в годах
  rate: number;        // Годовая ставка (например, 6)
}

export interface YearlyData {
  year: number;
  principalPaid: number; // Сколько за год выплачено основного долга
  interestPaid: number;  // Сколько за год выплачено процентов
}

export const calculateMortgage = ({ totalAmount, downPayment, years, rate }: CalculateProps) => {
  const loanAmount = totalAmount - downPayment; // Сумма самого кредита
  const months = years * 12;
  const monthlyRate = rate / 12 / 100; // Месячная ставка в долях

  // Если ставка 0%, то просто делим сумму на количество месяцев
  if (monthlyRate === 0) {
    return {
      monthlyPayment: loanAmount / months,
      totalOverpayment: 0,
      totalPaid: loanAmount
    };
  }

  // Формула аннуитетного платежа
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPaid = monthlyPayment * months;
  const totalOverpayment = totalPaid - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalOverpayment: Math.round(totalOverpayment),
    totalPaid: Math.round(totalPaid)
  };
};

export const calculateMortgageWithSchedule = ({ totalAmount, downPayment, years, rate }: CalculateProps) => {
  let loanAmount = totalAmount - downPayment;
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);

  const schedule: YearlyData[] = [];
  let remainingBalance = loanAmount;

  // Считаем распределение по годам
  for (let year = 1; year <= years; year++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    // Внутри каждого года перебираем 12 месяцев
    for (let month = 1; month <= 12; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;

      yearlyInterest += interestForMonth;
      yearlyPrincipal += principalForMonth;
      remainingBalance -= principalForMonth;
    }

    schedule.push({
      year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalOverpayment: Math.round((monthlyPayment * months) - loanAmount),
    schedule // Массив для графика
  };
};