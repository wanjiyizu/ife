export default function ({
	previousConformedValue = '',
	currentCaretPosition = 0,
	previousPlaceholder = '',
	placeholderChar,
	conformedValue,
	placeholder,
	rawValue
}) {
	if (currentCaretPosition === 0 || rawValue.length === 0) {
		return 0;
	}
	let rawValueLength = rawValue.length;
	let previousConformedValueLength = previousConformedValue.length;
	let placeholderLength = placeholder.length;
	let conformedValueLength = conformedValue.length;
	let editLength = rawValueLength - previousConformedValueLength;
	let isAddition = editLength > 0;
	// let isFirstRawValue = previousConformedValueLength === 0;
	// let isPartialMultiCharEdit = editLength > 1 && !isAddition && !isFirstRawValue;
	let possiblyHasRejectedChar = isAddition && (previousConformedValue === conformedValue || conformedValue === placeholder);
	let startingSearchIndex = 0;
	// let trackRightCharacter;
	let targetChar;
	if (possiblyHasRejectedChar) {
		startingSearchIndex = currentCaretPosition - editLength;
	} else {
		let leftHalfChar = rawValue.substr(0, currentCaretPosition).split('');
		let intersection = leftHalfChar.filter(char => conformedValue.indexOf(char) !== -1);
		targetChar = intersection[intersection.length - 1];
		let previousLeftMaskChars = previousPlaceholder.substr(0, intersection.length).split('').filter(char => char !== placeholderChar).length;
		let leftMaskChars = placeholder.substr(0, intersection.length).split('').filter(char => char !== placeholderChar).length;
		let maskLengthChanged = leftMaskChars - previousLeftMaskChars;
		let targetIsMaskMovingLeft = (
			previousPlaceholder[intersection.length - 1] !== undefined &&
			placeholder[intersection.length - 2] !== undefined &&
			previousPlaceholder[intersection.length - 1] !== placeholderChar &&
			previousPlaceholder[intersection.length - 1] !== placeholder[intersection.length - 1] &&
			previousPlaceholder[intersection.length - 1] === placeholder[intersection.length - 2]
		);
		if (
			!isAddition &&
			(maskLengthChanged || targetIsMaskMovingLeft) &&
			previousLeftMaskChars > 0 &&
			placeholder.indexOf(targetChar) > -1 &&
			rawValue[currentCaretPosition] !== undefined) {
			// trackRightCharacter = true;
			targetChar = rawValue[currentCaretPosition];
		}
		let countTargetCharInIntersection = intersection.filter(char => char === targetChar).length;
		let countTargetCharInPlaceholder = placeholder.substr(0, placeholder.indexOf(placeholderChar)).split('').filter((char, index) => {
			return char === targetChar && rawValue[index] !== char;
		}).length;
		let requiredNumberOfMatches = countTargetCharInIntersection + countTargetCharInPlaceholder;
		let numberOfEncounteredMatches = 0;
		for (let i = 0; i < conformedValueLength; i++) {
			let conformedValueChar = conformedValue[i];
			startingSearchIndex = i + 1;
			if (conformedValueChar === targetChar) {
				numberOfEncounteredMatches++;
			}
			if (numberOfEncounteredMatches >= requiredNumberOfMatches) {
				break;
			}
		}
	}
	if (isAddition) {
		let lastPlaceholderChar = startingSearchIndex;
		for (let i = startingSearchIndex; i <= placeholderLength; i++) {
			if (placeholder[i] === placeholderChar) {
				lastPlaceholderChar = i;
			}
			if (placeholder[i] === placeholderChar || placeholderLength === i) {
				return lastPlaceholderChar;
			}
		}
	} else {
		for (let i = startingSearchIndex; i >= 0; i--) {
			if (placeholder[i - 1] === placeholderChar || i === 0) {
				return i;
			}
		}
	}
}
