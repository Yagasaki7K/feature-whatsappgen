import React from "react";
import { ServerStyleSheet } from "styled-components";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { NextSeo } from "next-seo";

const title = "Titulo do Site";
const description = "Descrição do Site";
const url = "https://.vercel.app/";
const mention = "@campinas.fighters.team";

export default class MyDocument extends Document {
	// Fast refresh with NextJS doesn't broken the CSS
	static async getInitialProps(ctx: any) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App: any) => (props: any) =>
						sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}
	// Finish Here

	render() {
		return (
			<Html lang="pt-br">
				<NextSeo
					title={title}
					description={description}
					canonical={url}
					openGraph={{
						url: url,
						title: title,
						description: description,
						images: [
							{
								url: "/logo.png",
								width: 460,
								height: 460,
								alt: title,
								type: "image/png",
							},
						],
						siteName: mention,
					}}
					twitter={{
						handle: mention,
						site: mention,
						cardType: "summary_large_image",
					}}
				/>

				<Head>
					<meta
						name="keywords"
						content="taekwondo, sérgio, sergio, jesus, pacheco, alberto, iha, anderson, marlon, tae, kwon, do, coréia, liga, nacional, fetesp, federação, paulista, campinas, fighters, instituto, biológico, taquaral, prefeitura, municipal, parque, ecológico, faixa, preta, branca, iniciante, avançado, profissional, mário, mario, nacional, internacional, us, open, organização, sociedade, civil, disciplina, respeito, perseverança, dominio, cidadão, formação, atlética"
					/>

					<meta name="author" content="Anderson 'Yagasaki' Marlon" />
					<meta name="robots" content="index, follow" />
					<link rel="shortcut icon" href="/logo.png" type="image/png" />
					<meta property="og:locale" content="pt_BR" />

					<link
						rel="stylesheet"
						href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
					/>
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
