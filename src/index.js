import { default as Web3 } from 'web3'

let contractAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "input",
                "type": "string"
            }
        ],
        "name": "setKey",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getKey",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

let contractBytecode = "0x60c0604052600a60808190527f424153452056414c55450000000000000000000000000000000000000000000060a090815261003e9160009190610051565b5034801561004b57600080fd5b506100ec565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009257805160ff19168380011785556100bf565b828001600101855582156100bf579182015b828111156100bf5782518255916020019190600101906100a4565b506100cb9291506100cf565b5090565b6100e991905b808211156100cb57600081556001016100d5565b90565b6102ee806100fb6000396000f3fe608060405234801561001057600080fd5b5060043610610052577c0100000000000000000000000000000000000000000000000000000000600035046382678dd68114610057578063af42d106146100d4575b600080fd5b61005f61017c565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610099578181015183820152602001610081565b50505050905090810190601f1680156100c65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017a600480360360208110156100ea57600080fd5b81019060208101813564010000000081111561010557600080fd5b82018360208201111561011757600080fd5b8035906020019184600183028401116401000000008311171561013957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610213945050505050565b005b60008054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156102085780601f106101dd57610100808354040283529160200191610208565b820191906000526020600020905b8154815290600101906020018083116101eb57829003601f168201915b505050505090505b90565b805161022690600090602084019061022a565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061026b57805160ff1916838001178555610298565b82800160010185558215610298579182015b8281111561029857825182559160200191906001019061027d565b506102a49291506102a8565b5090565b61021091905b808211156102a457600081556001016102ae56fea165627a7a723058202c631d39ac67f02ecbfe187bc1a0b77dbda4c6a82b2c719c42402f165d2313450029";

if (typeof web3 !== 'undefined') {
    console.log('Metamask provider is used', web3.currentProvider);
    web3 = new Web3(web3.currentProvider);
} else {
    console.log('localhost being used');
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];

let stringSaverContract = new web3.eth.Contract(contractAbi, '0xb9d4c3049b6c7340890d849b8b4888acc17cc0b5');
let coinbase;

web3.eth.getCoinbase()
    .then((resCoinbase) => {
        coinbase = resCoinbase;

        stringSaverContract.methods.getKey().call({ from: coinbase }, (error, result) => {
            console.log('Initial string: ', error, result);
            document.getElementById('contractValue').innerHTML = result;
        });
        // let myContract = new web3.eth.Contract(contractAbi);            
        // myContract.deploy({ data: contractBytecode })
        // .send({
        //     from: coinbase,
        //     gas: 150000,
        //     gasPrice: '30000000000'
        // }, (error, transactionHash) => {
        //     console.log('transactionHash', transactionHash);
        // })
        // .on('error', function (error) { })
        // .on('transactionHash', function (transactionHash) { })
        // .on('receipt', function (receipt) {
        //     console.log('contractAddress', receipt.contractAddress)
        // })
        // .on('confirmation', function (confirmationNumber, receipt) { 
        //     console.log('Htr556');
        // });
    });


document.getElementById('buttonUpdateValue').addEventListener('click', () => {
    let newValue = document.getElementById('newContractValue').value;
    document.getElementById('newContractValue').value = '';
    document.getElementById('loadingIcon').style.visibility = 'visible';

    console.log('newContractValue (Unconfirmed)', newValue);
    let transaction = stringSaverContract.methods.setKey(newValue).send({ from: coinbase }, (error, result) => {
        if (error) {
            console.log(result);
        }
    });

    let funcUpdateVal = (confirmationNumber, receipt) => {
        console.log('onConfirmation', confirmationNumber, receipt)

        if(confirmationNumber == 4) {
            // unsubscribe to further confirmations
            transaction.off('confirmation', funcUpdateVal);

            stringSaverContract.methods.getKey().call({ from: coinbase }, (error, result) => {
                if (error) {
                    console.log(error, result);
                } else {
                    console.log('Confirmed string', result);
                    document.getElementById('contractValue').innerHTML = result;
                    document.getElementById('loadingIcon').style.visibility = 'hidden';
                }
            });
        }
    };

    // add event handler
    transaction.on('confirmation', funcUpdateVal);
});