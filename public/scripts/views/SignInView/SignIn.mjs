import BaseView from '../BaseView/BaseView.mjs';

import { Block } from '/scripts/blocks/Block/Block.mjs';
import { Form } from '/scripts/blocks/Form/Form.mjs';
import Menu from '../MenuView/Menu.mjs';
import { Users } from '/scripts/services/users.mjs';


export default class SignIn extends BaseView {
    constructor() {        
        const view = baseView({"headerType": "backToLanding","navClass": "backButton", "title": "Вход"});
        super(view);
    }

    render() {
        this._renderSignInPage();
    }

    _renderSignInPage() {
        const errorLine = new Block('p',['errorLine'],{'hidden': true});

        const inputs = [
            {
                classes: [],
                attributes: {
                    name: 'email',
                    type: 'email',
                    placeholder: 'Почта',
                    required: 'required'
                }
            },
            {
                classes: [],
                attributes: {
                    name: 'password',
                    type: 'password',
                    placeholder: 'Пароль',
                    required: 'required'
                }
            },
            {
                classes: [],
                attributes: {
                    name: 'submit',
                    type: 'submit',
                    value: 'Войти'
                }
            }
        ];

        const form = new Form(inputs);
        form.submit(data => {	//добавляем по нажатию кнопки событие
            Users.auth((err, response) => {	//авторизации пользователя
                console.log(err, response);
                if (err === null) {
                    application.innerHTML = '';
                    const mainMenu = new Menu();
	                mainMenu.render();
                } else {
                    const errorLine = document.getElementsByClassName('errorLine')[0];
                    errorLine.textContent = errorHandler(response.Message);
                    errorLine.hidden = false;
                }
            }, data);	//используем данные введенные в форму
        });
        
        this.pageContent.appendChild(errorLine.getElement());
        this.pageContent.appendChild(form.getElement());
    }
}

function errorHandler(error) {
	const errors = {
        'User not found': 'Пользователь не найден',
		'Wrong password': 'Не верно указана почта и/или пароль',
		'invalid': 'Невалидные данные',
		'user': 'Пользователь уже существует',
		'default': 'Ошибка... Попробуйте ввести данные еще раз',
        'passwords': 'Ошибка в повторном вводе пароля',
	};
	return errors[error];
}