import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';


export default function Home() {

  //shows no. of persons whitelisted
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0)
  //check if the current user has joined the whitelist or not
  const [ joinedWhitelist, setJoinedWhitelist] = useState(false)
  //shows whether wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false)
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();
  const [loading, setLoading] = useState(false)

  const getProviderOrSigner = async(needSigner = false) => {
    try{
      const provider = await web3ModalRef.current.connect()
      const web3Provider = new providers.Web3Provider(provider)

      const {chainId} = await web3Provider.getNetwork()
      if(chainId != 5){
        window.alert("Change the network to Goerli")
        throw new Error("Change the network to Goerli")
      }

      if(needSigner) {
        const signer = web3Provider.getSigner();
        return signer
      }

      return web3Provider
    }catch(err){
      console.error(err)
    }

  }

  const addAddressToWhitelist = async() => {
    try{
      const signer = await getProviderOrSigner(true);
      const whiteListedContract = new Contract(WHITELIST_CONTRACT_ADDRESS,abi,signer)

      const transac = await whiteListedContract.addAddressToWhitelist()
      setLoading(true);

      await transac.wait()
      setLoading(false)

      await getNumberOfWhiltelisted()
      setJoinedWhitelist(true)
    }catch(err){
      console.error(err)
    }
  }

  const checkIfAddressIsWhitelisted = async () =>{
    try{
      const signer = await getProviderOrSigner(true)
      const whiteListedContract = new Contract(WHITELIST_CONTRACT_ADDRESS,abi,signer)

      const address = await signer.getAddress();

      const _joinedWhitelist = await whiteListedContract.whitelistedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist)
    }catch(err){
      console.error(err)
    }
  }

  const getNumberOfWhiltelisted = async() => {
    try{
      const provider = await getProviderOrSigner()
      const whiteListedContract = new Contract(WHITELIST_CONTRACT_ADDRESS,abi,provider)

      const _numOfWhitelisted = await whiteListedContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted)
    }catch(err){
      console.error(err)
    }
  }

  const connectWallet = async() =>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true)
      checkIfAddressIsWhitelisted()
      getNumberOfWhiltelisted()
    }catch(err){
      console.error(err)
    }
  }


  const renderButton = () => {
    if(walletConnected){
      if(joinedWhitelist){
        return(
          <div className={styles.description}>
            Thanks for joining whitelist
          </div>
        )
      } else if(loading) {
        return <h1>Loading...</h1>
      } else{
        return(
          <button className= {styles.button} onClick={addAddressToWhitelist}>Join the Whitelist</button>
        )
      }
    }else{
      <button className={styles.button} onClick={connectWallet}>Connect your wallet</button>
    }
  }

  useEffect(() => {
   if(!walletConnected){
    web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions:{},
      disabledInjectedProvider: false
    });
    connectWallet()
   }
  }, [walletConnected])
  


  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          {/* <div className={styles.description}>
            {numOfWhitelisted} have already joined the Whitelist
          </div> */}
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  )
}
