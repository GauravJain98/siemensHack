// A $( document ).ready() block.
$(document).ready(function() {
    console.log('ready!');
});
// Initialize Web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}
// Set Account
web3.eth.defaultAccount = web3.eth.accounts[0];

web3.eth.getAccounts().then(console.log);

// Set Contract Abi
var contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_ipfsAddress",
				"type": "string"
			}
		],
		"name": "createKidney",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "ipfsAddress",
				"type": "string"
			}
		],
		"name": "KidneyCreated",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "toggleActive",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getKidney",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKidneyIds",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
// Set Contract Address
var contractAddress = '0xf3046bf62ab54c87bf1ecc2e43ef52219e496c8a'; // Add Your Contract address here!!!

// Set the Contract
//var contract = web3.eth.Contract(contractAbi).at(contractAddress);

var contract = new web3.eth.Contract(contractAbi, contractAddress);

getOrganArrayIndex = async () => {
    let index = 1;
    await contract.methods
        .getKidneyIds()
        .call(
            { from: '0xB8441d33e223D88D9A37d83d4921A12462F23848' },
            (error, result) => console.log(error, result)
        )
        .then(result => (index = result.length));
    return index - 1;
};

getOrganHash = async id => {
    let OrganHash;
    await contract.methods
        .getKidney(id)
        .call(
            { from: '0xB8441d33e223D88D9A37d83d4921A12462F23848' },
            (error, result) => console.log(error, result)
        )
        .then(res => {
            OrganHash = res['2'];
        });
    return OrganHash;
};

getAllHashes = async () => {
    let ipfsHashes = [];
    await getOrganArrayIndex().then(res=>{
        for (let i = 1; i <= res; i++) {
            ipfsHashes.push(getOrganHash(i));
        }
    })
    
    return ipfsHashes;
};

getOrgans = async () => {
    let organArray = [];
    getAllHashes().then(async res=>{
        let hashArray = res
        console.log(hashArray)
        for (let i = 0; i <= hashArray.length; i++) {
            await axios({
                method: 'get',
                url: `http://localhost:8080/ipfs/${hashArray[i]}`,
                responseType: 'json'
            }).then(async respose => {
                await organArray.push(respose.data);
            });
        }    
    });
    return organArray;
};

giveOrgans = async () => {
    getOrgans().then(async res=>{
        await axios({
            method: 'post',
            url: 'http://localhost:5000/allOrganData',
            data: res
        });
    })
};

$('#form1').on('submit', async event => {
    event.preventDefault();

    await axios({
        method: 'get',
        url: 'http://localhost:5000/data',
        responseType: 'json'
    }).then(respose => {
        contract.methods
            .createKidney(respose.data.hash)
            .send(
                { from: '0xB8441d33e223D88D9A37d83d4921A12462F23848' },
                (error, result) => {
                    console.log(error, result);
                }
            )
            .then(res => {
                console.log(res);
                giveOrgans();
            });
    });
});
