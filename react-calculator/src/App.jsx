
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const formatResult = (number) => {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(12)));
  };

  const inputDigit = (digit) => {
    if (display === "Error" || waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression("");
  };

  const deleteDigit = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0");
      setWaitingForOperand(false);
      return;
    }

    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const toggleSign = () => {
    if (display !== "0" && display !== "Error") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  };

  const percentage = () => {
    if (display !== "Error") {
      setDisplay(formatResult(Number(display) / 100));
      setWaitingForOperand(true);
    }
  };

  const calculate = (first, second, op) => {
    switch (op) {
      case "+":
        return first + second;
      case "−":
        return first - second;
      case "×":
        return first * second;
      case "÷":
        return second === 0 ? NaN : first / second;
      default:
        return second;
    }
  };

  const chooseOperator = (nextOperator) => {
    if (display === "Error") return;

    const inputValue = Number(display);

    if (operator && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator);
      const formatted = formatResult(result);

      setDisplay(formatted);
      setPreviousValue(Number(formatted));
      setExpression(`${formatted} ${nextOperator}`);
    } else {
      setPreviousValue(inputValue);
      setExpression(`${display} ${nextOperator}`);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const equals = () => {
    if (operator === null || previousValue === null || display === "Error") {
      return;
    }

    const result = calculate(previousValue, Number(display), operator);
    setExpression(`${previousValue} ${operator} ${display} =`);
    setDisplay(formatResult(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (/^[0-9]$/.test(key)) inputDigit(key);
      else if (key === ".") inputDecimal();
      else if (key === "+") chooseOperator("+");
      else if (key === "-") chooseOperator("−");
      else if (key === "*") chooseOperator("×");
      else if (key === "/") {
        event.preventDefault();
        chooseOperator("÷");
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
      } else if (key === "Backspace") deleteDigit();
      else if (key === "Escape") clear();
      else if (key === "%") percentage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const buttons = [
    { label: "AC", action: clear, type: "utility" },
    { label: "DEL", action: deleteDigit, type: "utility" },
    { label: "%", action: percentage, type: "utility" },
    { label: "÷", action: () => chooseOperator("÷"), type: "operator" },
    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", action: () => chooseOperator("×"), type: "operator" },
    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "−", action: () => chooseOperator("−"), type: "operator" },
    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", action: () => chooseOperator("+"), type: "operator" },
    { label: "+/−", action: toggleSign, type: "utility" },
    { label: "0", action: () => inputDigit("0") },
    { label: ".", action: inputDecimal },
    { label: "=", action: equals, type: "equals" },
  ];

  return (
    <main className="app">
      <section className="calculator">
        <header className="calculator-header">
          <div>
            <p className="eyebrow">SMART TOOLS</p>
            <h1>Calculator</h1>
          </div>
          <div className="calculator-icon">✳</div>
        </header>

        <div className="display">
          <div className="expression">{expression || "Ready to calculate"}</div>
          <div className="result" aria-live="polite" title={display}>
            {display}
          </div>
        </div>

        <div className="keypad">
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              className={`key ${button.type || ""} ${
                operator === button.label ? "active" : ""
              }`}
              onClick={button.action}
              aria-label={button.label}
            >
              {button.label}
            </button>
          ))}
        </div>

        <footer className="calculator-footer">
          <span><span className="status-dot" /> Ready</span>
          <span>Keyboard supported</span>
        </footer>
      </section>

      <p className="page-caption">Simple calculations. Clear results.</p>
    </main>
  );
}

export default App;
