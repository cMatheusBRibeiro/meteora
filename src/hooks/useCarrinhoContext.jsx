import { useContext, useEffect } from "react";
import { CarrinhoContext } from "../context/CarrinhoContext";

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidade,
    setQuantidade,
    valorTotal,
    setValorTotal,
  } = useContext(CarrinhoContext);

  const buscarProdutoPeloId = (id) => {
    return carrinho.find((itemCarrinho) => itemCarrinho.id === id);
  };

  const existeProdutoNoCarrinho = (id) => {
    return carrinho.some((itemCarrinho) => itemCarrinho.id === id);
  };

  const mudarQuantidade = (idProduto, quantidadeParaSomar) => {
    return carrinho.map((itemCarrinho) => {
      if (itemCarrinho.id === idProduto)
        itemCarrinho.quantidade += quantidadeParaSomar;
      return itemCarrinho;
    });
  };

  const adicionarProduto = (novoProduto) => {
    const temOProduto = existeProdutoNoCarrinho(novoProduto.id);

    if (!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho([...carrinho, novoProduto]);
    }

    const carrinhoAtualizado = mudarQuantidade(novoProduto.id, 1);

    return setCarrinho(carrinhoAtualizado);
  };

  const removerProduto = (idProduto) => {
    const produto = buscarProdutoPeloId(idProduto);

    if (!produto) {
      return;
    }

    const ehOUltimo = produto.quantidade === 1;

    if (ehOUltimo) {
      return removerProdutoCarrinho(idProduto);
    }

    const carrinhoAtualizado = mudarQuantidade(idProduto, -1);

    return setCarrinho(carrinhoAtualizado);
  };

  const removerProdutoCarrinho = (idProduto) => {
    const carrinhoAtualizado = carrinho.filter(
      (itemCarrinho) => itemCarrinho.id !== idProduto
    );
    setCarrinho(carrinhoAtualizado);
  };

  useEffect(() => {
    const { totalTemp, quantidadeTemp } = carrinho.reduce(
      (acumulador, produto) => ({
        quantidadeTemp: acumulador.quantidadeTemp + produto.quantidade,
        totalTemp: acumulador.totalTemp + produto.quantidade * produto.preco,
      }),
      {
        quantidadeTemp: 0,
        totalTemp: 0,
      }
    );
    setQuantidade(quantidadeTemp);
    setValorTotal(totalTemp);
  }, [carrinho]);

  return {
    carrinho,
    setCarrinho,
    quantidade,
    valorTotal,
    buscarProdutoPeloId,
    adicionarProduto,
    removerProduto,
    removerProdutoCarrinho,
  };
};
