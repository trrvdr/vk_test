import React, { useState } from 'react';  
import { Panel, PanelHeader, Header, Group, Div, Button, Cell, Avatar } from '@vkontakte/vkui';  
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';  
import PropTypes from 'prop-types';  
import bridge from '@vkontakte/vk-bridge';  
  
export const Home = ({ id, fetchedUser }) => {  
    const { photo_200, city, first_name, last_name } = { ...fetchedUser };  
    const routeNavigator = useRouteNavigator();  
    const [imageUrl, setImageUrl] = useState('');  
    const [showImage, setShowImage] = useState(false);  
    const [errorMessage, setErrorMessage] = useState('');  
  
    const openImageWithVKBridge = () => {
        if (imageUrl.trim() !== '') {
            if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                bridge.send('VKWebAppShowImages', { images: [imageUrl] })
                    .then((data) => {
                        if (data.result) {
                            setErrorMessage('');
                            // Нативный экран открыт
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setErrorMessage('Ошибка при открытии изображения');
                        setShowImage(false);
                    });
            } else {
                setErrorMessage('Некорректные данные. Введите ссылку на изображение');
                setShowImage(false);
            }
        } else {
            setErrorMessage('Поле ввода не должно быть пустым');
            setShowImage(false);
        }
    };
    

    return (  
        <Panel id={id}>  
            <PanelHeader>Главная</PanelHeader>  
            {fetchedUser && (  
                <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>  
                    <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>  
                        {first_name} {last_name}  
                    </Cell>  
                </Group>  
            )}  
            <Group header={<Header mode="secondary">App Example</Header>}>  
                <Div style={{ marginTop: '50px', textAlign: 'center' }}>  
                    <input  
                        type="url"  
                        placeholder="Введите ссылку на изображение"  
                        value={imageUrl}  
                        onChange={(e) => setImageUrl(e.target.value)}  
                        style={{ width: '80%', height: '25px' }}  
                    />  
                </Div>  
                <Div style={{ marginTop: '20px', textAlign: 'center' }}>  
                    <Button stretched size="l" mode="secondary" onClick={openImageWithVKBridge}>  
                        Открыть изображение  
                    </Button>  
                </Div>  
                {errorMessage && (  
                    <Div style={{ marginTop: '10px', textAlign: 'center', color: 'red' }}>  
                        {errorMessage}  
                    </Div>  
                )}  
  
                {showImage && (  
                    <Div style={{ marginTop: '20px', textAlign: 'center' }}>  
                        <img src={imageUrl} alt="Изображение" style={{ maxWidth: '100%', maxHeight: '400px' }} />  
                    </Div>  
                )}  
            </Group>  
        </Panel>  
    );  
};  
  
Home.propTypes = {  
    id: PropTypes.string.isRequired,  
    fetchedUser: PropTypes.shape({  
        photo_200: PropTypes.string,  
        first_name: PropTypes.string,  
        last_name: PropTypes.string,  
        city: PropTypes.shape({  
            title: PropTypes.string,  
        }),  
    }),  
};  
