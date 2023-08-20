import { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Button,
  Heading,
  Image,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

export default function SimpleCard({ setOwner }) {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  const getWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      return web3;
    }
    return null;
  };

  const connectToMetaMask = async () => {
    const web3 = await getWeb3();
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      localStorage.setItem('address', accounts[0]);
      console.log(accounts);
      if (accounts[0] === localStorage.getItem('owner')) {
        setOwner(true);
        navigate('/addpet');
      } else {
        setOwner(false);
        navigate('/view');
      }
    } else {
      console.log('MetaMask not available');
      localStorage.setItem('address', null);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (newAccounts) => {
      if (newAccounts.length > 0) {
        setAccount(newAccounts[0]);
      } else {
        setAccount(null);
      }
    };

    // Listen for MetaMask account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Cleanup when component unmounts
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <Stack spacing={10}>
              <Button
                bg={'green.400'}
                color={'white'}
                onClick={connectToMetaMask}
                _hover={{
                  bg: 'blue.500',
                }}>
                Connect with Metamask
                <Image src={'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png'} width='10%'/>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
