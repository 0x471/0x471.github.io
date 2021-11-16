# Pow & PoS Algorithms

## Proof of Work (PoW) Algorithm

Bitcoin uses the PoW algorithm to reach consensus between nodes. Satoshi Nakamato used it as a way to secure the Bitcoin blockchain. Even so, the algorithm works by having all nodes to solve a cryptographic task. This task is solved by **miners** and the first one who finds the solution gets the miner reward which is known as transaction fee. This has led to a situation where people build larger mining rigs and mining farms. Unfortunately, bitcoin energy consumption increases too much because of this situation.
        
PoW algorithm gives more rewards to people with better and more equipment. Hashrate is computational power that is being used to mine and process transactions. Hashrate and chance of creating the next block, recieving the mining reward is directly propotional. In addition, to increase their chances miners come together and combine their hashing power, hashrate. 

As a summary, PoW cause miners to use gigantic amounts of energy and miner pools make blockchain more centralized which is not good for de centralization. To solve these issues, a new consensus algorithm that is alternative to PoW algorithm was proposed which is called as "Proof of Stake" algorithm.

## Proof of Stake (PoS) Algorithm

There is no miners, only validators in PoS algorithm. The main idea of PoS algorithm is choosing a node randomly to validate the next block. It doesn't let people to mine blocks. Furthermore, these validators are **not** choosen completely randomly. To become a validator, nodes should deposit a certain amonut of coins into the network as stake. It is like a deposit for security. The size of the stake determines the chance to be choosen for validation of the next block. Like hashrate, stake is also directly propotional for being chosen.

If validators approve crooked transactions, they lose a part of their stakeand that's how trust is ensured. If a node stops being a validator, stake + all transaction fees will be released after a certain period of time.

# References

[1] [https://cointelegraph.com/explained/proof-of-work-explained](https://cointelegraph.com/explained/proof-of-work-explained)

[2] [https://www.investopedia.com/terms/p/proof-work.asp](https://www.investopedia.com/terms/p/proof-work.asp)

[3] [https://www.investopedia.com/terms/p/proof-stake-pos.asp](https://www.investopedia.com/terms/p/proof-stake-pos.asp)

[4] [https://en.wikipedia.org/wiki/Proof_of_stake](https://en.wikipedia.org/wiki/Proof_of_stake)

[5] [https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
