function formatCNPJ(cnpj) {
    return cnpj
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

function formatCPF(cpf) {
    return cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
}

function formatCEP(cep) {
    return cep
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");
}

function formatPhone(phone) {
    if (phone.length == 10) {
        return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    } else if (phone.length == 11) {
        return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    return phone;
}

function formatMoney(value) {
    if (!value) {
        return 'R$ 0,00';
    }

    if (typeof value == "string") {
        value = Number(value);
    }

    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export { formatCNPJ, formatCPF, formatCEP, formatPhone, formatMoney };