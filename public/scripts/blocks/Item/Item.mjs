import Block from '../Block/Block.mjs';

/**
 * Класс кнопки (наследуется от Block)
 * @module Button
 */
export default class Item extends Block {
	/**
     * Создать новую кнопку
     * @param {string} link адрес ссылки
     * @param {string} text текст кнопки
     * @param {Array} classes классы кнопки
     */
	constructor (name = '', callback, classes = ['basic-button']) {
		super('div', classes);

		this.setText(name);
		this.event('click', callback);
	}
}