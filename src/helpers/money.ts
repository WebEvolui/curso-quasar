function showMoney(valor: number): string {
  const formated = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    currencyDisplay: "symbol",
  })
    .format(valor)
    .replace("R$", "")
    .trim();

  return formated;
}

function moneyToDB(valor: string): number {
  let money: number;

  if (valor.match(/^[0-9]*\.?[0-9]*$/)) {
    money = Number(valor);
  } else {
    money = Number(
      valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
    );
  }

  return money;
}

export { showMoney, moneyToDB };
