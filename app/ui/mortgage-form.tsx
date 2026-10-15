'use client';

import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { calculateMortgage, calculateMortgageWithSchedule, YearlyData } from '@/utils/calculate';
import MortgageChart from './mortgage-chart';
import MortgageBarChart from './mortgage-bar-chart';
import { formatCurrency } from '@/utils/format-currency';

interface Result {
  monthlyPayment: number;
  totalOverpayment: number;
  schedule: YearlyData[];
}

export default function MortgageForm() {
  // Состояния для параметров кредита
  const [totalAmount, setTotalAmount] = useState<number>(2000000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [years, setYears] = useState<number>(15);
  const [rate, setRate] = useState<number>(12); // Базовая ставка для абстрактного калькулятора

  // Состояние для результатов расчета
  // const [results, setResults] = useState({
  //   monthlyPayment: 0,
  //   totalOverpayment: 0,
  //   totalPaid: 0,
  // });

  // // Состояние для результатов расчета
  // const [results, setResults] = useState<Result>({
  //   monthlyPayment: 0,
  //   totalOverpayment: 0,
  //   schedule: [],
  // });

  // // const data = calculateMortgage({ totalAmount, downPayment, years, rate });
  // // Пересчитываем каждый раз при изменении инпутов
  // useEffect(() => {
  //   const data = calculateMortgageWithSchedule({ totalAmount, downPayment, years, rate });
  //   setResults(data);
  // }, [totalAmount, downPayment, years, rate]);


  // const deferredRate = useDeferredValue(rate);

  // const results = useMemo<Result>(() => {
  //   return calculateMortgageWithSchedule({ totalAmount, downPayment, years, rate: deferredRate });
  // }, [totalAmount, downPayment, years, deferredRate]);

  const [debouncedParams, setDebouncedParams] = useState({
    totalAmount,
    downPayment,
    years,
    rate,
  }); 

  // // ОДИН ЭФФЕКТ-ЗАЩИТНИК НА ВСЕ ПОЛЯ
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     console.log('hello');
  //     setDebouncedParams({ totalAmount, downPayment, years, rate });
  //   }, 350); // 350мс — идеальный баланс между отзывчивостью и защитой анимации

  //   return () => clearTimeout(handler);
  // }, [totalAmount, downPayment, years, rate]); // Следим за ВСЕМИ полями сразу


  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    // Как только параметры изменились, мы знаем, что идет движение
    setIsMoving(true); 

    const handler = setTimeout(() => {
      setDebouncedParams({ totalAmount, downPayment, years, rate });
      // Движение закончилось, данные обновились — можно анимировать!
      setIsMoving(false); 
    }, 300); // 300-350мс вполне достаточно

    return () => clearTimeout(handler);
  }, [totalAmount, downPayment, years, rate]);

  // ТЯЖЕЛЫЕ РАСЧЕТЫ (зависят только от дебаунс-объекта)
  const results = useMemo(() => {
    return calculateMortgageWithSchedule(debouncedParams);
  }, [debouncedParams]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Левая колонка: Ввод данных */}
      <Card>
        <CardHeader>
          <CardTitle>Параметры кредита</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Сумма недвижимости */}
          <div className="space-y-2">
            <label className="flex justify-between">
              <span>Стоимость недвижимости (руб.)</span>
              <span className='font-semibold'>{formatCurrency(totalAmount)}</span>
            </label>
            <Input 
              type="number" 
              value={totalAmount} 
              onChange={(e) => setTotalAmount(Number(e.target.value))} 
            />
            <Slider 
              value={[totalAmount]} 
              min={300000} 
              max={30000000} 
              step={100000} 
              onValueChange={(val) => setTotalAmount(val as number)} 
            />
          </div>

          {/* Первоначальный взнос */}
          <div className="space-y-2">
            <label className="flex justify-between">
              <span>Первоначальный взнос (руб.)</span>
              <span className='font-semibold'>{formatCurrency(downPayment)}</span>
            </label>
            <Input 
              type="number" 
              value={downPayment} 
              onChange={(e) => setDownPayment(Number(e.target.value))} 
            />
            <Slider 
              value={[downPayment]} 
              min={totalAmount * 0.1} 
              max={totalAmount} 
              step={10000}
              onValueChange={(val) => setDownPayment(val as number)} 
            />
          </div>

          {/* Срок кредита */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Срок кредита (лет): {years}</label>
            <Slider 
              value={[years]} 
              min={1} 
              max={30} 
              step={1} 
              onValueChange={(val) => setYears(val as number)} 
            />
          </div>

          {/* Процентная ставка */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Процентная ставка (%): {rate}</label>
            <Slider 
              value={[rate]} 
              min={2} 
              max={35} 
              step={0.1} 
              onValueChange={(val) => {
                const actualRate = Array.isArray(val) ? val[0] : val;
                setRate(actualRate);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Правая колонка: Вывод результатов (сюда же потом встанет график) */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle>Результаты расчета</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Ежемесячный платеж</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</p>
            <p className="text-sm text-muted-foreground">Рекомендуемый доход</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(results.monthlyPayment * 2)}</p>
          </div>

          <MortgageChart
            loanAmount={totalAmount - downPayment}
            totalOverpayment={results.totalOverpayment}
          />

          <MortgageBarChart
            data={results.schedule}
            isAnimationActive={!isMoving}
          />

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Основной долг</p>
            <p className="text-xl font-semibold">{formatCurrency(totalAmount - downPayment)}</p>
            <p className="text-sm text-muted-foreground">Переплата по процентам</p>
            <p className="text-xl font-semibold text-destructive">{formatCurrency(results.totalOverpayment)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}