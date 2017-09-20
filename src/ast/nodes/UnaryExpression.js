import Node from '../Node.js';
import { UNDEFINED_ASSIGNMENT, UNKNOWN_VALUE } from '../values';

const operators = {
	'-': value => -value,
	'+': value => +value,
	'!': value => !value,
	'~': value => ~value,
	typeof: value => typeof value,
	void: () => undefined,
	delete: () => UNKNOWN_VALUE
};

export default class UnaryExpression extends Node {
	bind () {
		if ( this.value === UNKNOWN_VALUE ) super.bind();
		if ( this.operator === 'delete' ) {
			this.argument.bindAssignmentAtPath( [], UNDEFINED_ASSIGNMENT );
		}
	}

	getValue () {
		const argumentValue = this.argument.getValue();
		if ( argumentValue === UNKNOWN_VALUE ) return UNKNOWN_VALUE;

		return operators[ this.operator ]( argumentValue );
	}

	hasEffects ( options ) {
		return this.included
			|| this.argument.hasEffects( options )
			|| (this.operator === 'delete' && (
				this.argument.type !== 'MemberExpression'
				|| this.argument.object.hasEffectsWhenMutatedAtPath( [], options )
			));
	}

	hasEffectsAsExpressionStatement ( options ) {
		return this.hasEffects( options );
	}

	initialiseNode () {
		this.value = this.getValue();
	}
}
