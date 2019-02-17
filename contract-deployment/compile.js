const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const contractPath = path.resolve(__dirname, 'contracts', 'simple-dapp.sol');
const source = fs.readFileSync(contractPath, 'UTF-8');

var input = {
    language: 'Solidity',
    sources: {
        'simple-dapp.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
}

const res = JSON.parse(solc.compile(JSON.stringify(input)));
console.log('compiled');

const abi = res.contracts['simple-dapp.sol'].StringSaver.abi;
const bytecode = res.contracts['simple-dapp.sol'].StringSaver.evm.bytecode.object;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
return web3.eth.getCoinbase()
    .then((coinbase) => {
        let contract = web3.eth.Contract(abi, undefined);
        return contract.deploy({ data: '0x' + bytecode })
            .send({
                from: coinbase,
                gas: 1606000,
                gasPrice: '20000000000'
            }, (error, transactionHash) => {
                console.log('transactionHash', transactionHash);
            })
            .on('error', function (error) {
                console.log('error', error);
            })
            .on('transactionHash', function (transactionHash) { })
            .on('receipt', function (receipt) {
                console.log('contractAddress', receipt.contractAddress)
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log('confirmation', confirmationNumber);
            });
    });
