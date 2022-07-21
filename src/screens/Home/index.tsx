import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    // Get asyncStorage data, use setSearchListData and setData

    // salvando as informações em cada estado em formato de string
    const response = await AsyncStorage.getItem(dataKey);
      if(response) {
        const parsedData = JSON.parse(response);

        setSearchListData(parsedData);
        setData(parsedData);
      }
  }

  function handleFilterLoginData() {
    // Filtra os resultados dentro dos dados, salve com setSearchListData
    // para cada dado(data) se cada dado do service inclui o tempo searchText
    const filteredData = searchListData.filter(data => {
      // para que mesmo q coloque em baixa alta, ele ache o nome inferido
      const isValid = data.service_name.toLowerCase()
      .includes(searchText.toLowerCase());

      if (isValid){
        return data;
      }
    });

    setSearchListData(filteredData)
  }

  function handleChangeInputText(text: string) {
    // Update searchText value
    // para apagar todos os registro quando nao tiver nenhuma letra na pesquisa
    if(!text) {
      setSearchListData(data);
    }
    // receber o texto do input e salvar no estado do setSearchText
    setSearchText(text)
    
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}