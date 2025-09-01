import Link from "next/link";
import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

// ===================== KEYFRAMES =====================
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const toastSlide = keyframes`
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
`;

// ===================== STYLED COMPONENTS =====================
const Hero = styled.main`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f131a, #181d25);
  position: relative;
  overflow-x: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  padding: 1rem;
  width: 100%;
  max-width: 32rem;
  
  p {
	color: #e5e5e5;
  }
`;

const Card = styled.div`
  background: linear-gradient(145deg, #171c26, #272c35);
  border: 1px solid #363d49;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(15, 19, 26, 0.5);
  backdrop-filter: blur(8px);
  width: 100%;
  animation: ${slideIn} 0.3s ease-out;
  margin-top: 1rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Image = styled.img`
  width: 10rem;
  border-radius: 100px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #f4a259, #b4621a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Subtitle = styled.h2`
  text-align: center;
  color: #b4621a;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #e5e5e5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  height: 3rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #363d49;
  background: #272c35;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #e5e5e5;
  transition: all 0.3s ease;

  &::placeholder {
    color: #e5e5e5;
  }
  &:focus {
    outline: none;
    border-color: #f4a259;
    box-shadow: 0 0 0 2px rgba(162, 90, 22, 0.2);
    background: #2b303b;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  height: 2.75rem;
  padding: 0 2rem;
  width: 100%;
  background: linear-gradient(135deg, #f4a259, #b4621a);
  color: #e5e5e5;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(162, 90, 22, 0.4);
  }
`;

const LinkDisplay = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallInput = styled(Input)`
  font-size: 0.75rem;
  font-family: "Courier New", monospace;
`;

const Toast = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 100;
  background: #171c26;
  border: 1px solid #363d49;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(15, 19, 26, 0.5);
  padding: 1rem;
  max-width: 20rem;
  animation: ${toastSlide} 0.3s ease-out;
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

// ===================== COMPONENT =====================
const WhatsLinkGenerator: React.FC = () => {
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [generatedLink, setGeneratedLink] = useState("");
	const [toast, setToast] = useState<{
		title: string;
		description: string;
	} | null>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Formata número brasileiro
	const formatPhoneNumber = (value: string) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 2) return numbers;
		if (numbers.length <= 7)
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
		if (numbers.length <= 11)
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
	};

	const handleGenerate = () => {
		const phoneNumbers = phone.replace(/\D/g, "");
		if (phoneNumbers.length < 10) {
			showToast("Número inválido", "Por favor, insira um número válido.");
			return;
		}
		const fullPhone = phoneNumbers.startsWith("55")
			? phoneNumbers
			: `55${phoneNumbers}`;
		const encodedMessage = message ? encodeURIComponent(message) : "";
		const url = `https://wa.me/${fullPhone}${message ? `?text=${encodedMessage}` : ""}`;
		setGeneratedLink(url);
		showToast("Link gerado com sucesso!", "Seu link do WhatsApp está pronto.");
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(generatedLink);
			showToast(
				"Link copiado!",
				"O link foi copiado para a área de transferência.",
			);
		} catch {
			showToast("Erro ao copiar", "Não foi possível copiar o link.");
		}
	};

	const showToast = (title: string, description: string) => {
		setToast({ title, description });
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setToast(null), 3000);
	};

	return (
		<>
			<Hero>
				<Container>
					<Image src="https://github.com/Engide.png" alt="" />
					<Title>WhatsLink Generator</Title>
					<Subtitle>
						Crie links diretos para o WhatsApp de forma rápida e fácil
					</Subtitle>
					<p>
						Desenvolvido pela{" "}
						<Link href="https://engide.com.br" target="_blank">
							Engide Technology Co
						</Link>
						.
					</p>

					<Card>
						<CardContent>
							<Label>Número do WhatsApp</Label>
							<Input
								type="tel"
								placeholder="(11) 99999-9999"
								value={phone}
								onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
							/>

							<Label>Mensagem (opcional)</Label>
							<Input
								type="text"
								placeholder="Olá! Como posso ajudar?"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>

							<Button onClick={handleGenerate}>Gerar Link do WhatsApp</Button>
						</CardContent>
					</Card>

					{generatedLink && (
						<Card>
							<CardContent>
								<Label>Link gerado:</Label>
								<LinkDisplay>
									<SmallInput value={generatedLink} readOnly />
									<Button
										style={{ width: "auto", padding: "0 1rem" }}
										onClick={handleCopy}
									>
										Copiar
									</Button>
								</LinkDisplay>
							</CardContent>
						</Card>
					)}
				</Container>

				<Toast visible={!!toast}>
					<div>
						<strong>{toast?.title}</strong>
						<p>{toast?.description}</p>
					</div>
				</Toast>
			</Hero>
		</>
	);
};

export default WhatsLinkGenerator;
