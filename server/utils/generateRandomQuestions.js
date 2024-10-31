const generateRandomQuestion = () => {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let question;
    let answer;

    switch (operator) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
        case '*':
            question = `${num1} * ${num2}`;
            answer = num1 * num2;
            break;
        case '/':
            question = `${num1} / ${num2}`;
            answer = num2 !== 0 ? (num1 / num2).toFixed(2) : 'undefined'; // Prevent division by zero
            break;
        default:
            break;
    }

    return { question, answer };
};

module.exports = generateRandomQuestion;
