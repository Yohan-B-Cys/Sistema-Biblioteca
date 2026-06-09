import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest"; // ou do 'jest'
import { BrowserRouter } from "react-router-dom";
import AddBook from "./AddBook";
import api from "../services/api";

// 1. Simula a nossa API para não tocar no banco real
vi.mock("../services/api", () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
    get: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Helper para renderizar com o Router (já que usamos useNavigate e useParams)
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Componente AddBook", () => {
  
  it("deve converter o ano para negativo se o checkbox a.C. estiver marcado", async () => {
    // Renderiza o componente na tela virtual do teste
    renderWithRouter(<AddBook />);

    // 2. Captura os elementos da tela pelos textos/placeholders
    const inputTitulo = screen.getByPlaceholderText(/Ex: Senhor Dos Aneis/i);
    const inputAutor = screen.getByPlaceholderText(/Ex: J.R.R Tolkien/i);
    const inputAno = screen.getByPlaceholderText(/Ex: 1953/i);
    const checkboxAC = screen.getByLabelText(/Antes de Cristo \(a.C.\)/i);
    const botaoCadastrar = screen.getByRole("button", { name: /Cadastrar/i });

    // 3. Simula o usuário preenchendo o formulário de Platão
    await userEvent.type(inputTitulo, "A República");
    await userEvent.type(inputAutor, "Platão");
    await userEvent.type(inputAno, "375");
    
    // Clica no checkbox para ativar a era Antes de Cristo
    await userEvent.click(checkboxAC);

    // 4. Envia o formulário
    await userEvent.click(botaoCadastrar);

    // 5. O ASSERTO (A Verificação): A API recebeu o ano como -375?
    expect(api.post).toHaveBeenCalledWith("/", {
      titulo: "A República",
      autor: "Platão",
      ano: -375 // Aqui garante que sua regra de negócio no front funcionou!
    });
  });

  it("deve mostrar erro se o título tiver menos de 2 caracteres", async () => {
    renderWithRouter(<AddBook />);
    
    const inputTitulo = screen.getByPlaceholderText(/Ex: Senhor Dos Aneis/i);
    const botaoCadastrar = screen.getByRole("button", { name: /Cadastrar/i });

    // Digita apenas uma letra
    await userEvent.type(inputTitulo, "A");
    await userEvent.click(botaoCadastrar);

    // Como o toast dispara um erro, a API de POST não pode ter sido chamada
    expect(api.post).not.toHaveBeenCalled();
  });
});