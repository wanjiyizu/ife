export default function (rawValue = '', mask = [], config = {}) {
	let {
		guide = true,
		previousConformedValue,
		placeholderChar,
		placeholder,
		currentCaretPosition,
		keepCharPositions
	} = config;
	let supperssGuide = guide === false && previousConformedValue !== undefined;
	let rawValueLength = rawValue.length;
	let previousConformedValueLength = previousConformedValue.length;
	let placeholderLength = placeholder.length;
	let editLength = rawValueLength - previousConformedValueLength;
	let isAddition = editLength > 0;
	let indexOfFirstChange = currentCaretPosition + (isAddition ? -editLength : 0);
	let indexOfLastChange = indexOfFirstChange + Math.abs(editLength);
	// console.log(`indexOfFirstChange: ${indexOfFirstChange}, indexOfLastChange: ${indexOfLastChange}`);
	if (keepCharPositions === true && !isAddition) {
		let compensatingPlaceholderChars = '';
		for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
			if (placeholder[i] === placeholderChar) {
				compensatingPlaceholderChars += placeholderChar;
			}
		}
		rawValue = rawValue.slice(0, indexOfFirstChange) + compensatingPlaceholderChars + rawValue.slice(indexOfFirstChange, rawValueLength);
		// console.log(rawValue.slice(0, indexOfFirstChange));
		// console.log(compensatingPlaceholderChars);
		// console.log(rawValue.slice(indexOfFirstChange, rawValueLength));
	}
	let rawValueArr = rawValue.split('').map((char, i) => {
		return {
			char,
			isNew: i >= indexOfFirstChange && i < indexOfLastChange
		};
	});
	for (let i = rawValueArr.length - 1; i >= 0; i--) {
		let {char} = rawValueArr[i];
		if (char !== placeholderChar) {
			let shouldOffset = i >= indexOfFirstChange && previousConformedValueLength === placeholderLength;
			if (char === placeholder[shouldOffset ? i - editLength : i]) {
				rawValueArr.splice(i, 1);
			}
		}
	}
	// console.log(rawValueArr.slice());
	let conformedValue = '';
	let realValue = '';
	placeholderLoop: for (let i = 0; i < placeholderLength; i++) {
		let charInPlaceholder = placeholder[i];
		if (charInPlaceholder === placeholderChar) {
			if (rawValueArr.length > 0) {
				while (rawValueArr.length > 0) {
					let {char: rawValueChar, isNew} = rawValueArr.shift();
					if (rawValueChar === placeholderChar) {
						conformedValue += placeholderChar;
						continue placeholderLoop;
					} else if (mask[i].test(rawValueChar)) {
						realValue += rawValueChar;
						if (keepCharPositions === false || isNew === false || previousConformedValue === '') {
							conformedValue += rawValueChar;
						} else {
							let rawValueArrLength = rawValueArr.length;
							let indexOfNextAvailablePlaceholderChar = null;
							for (let i = 0; i < rawValueArrLength; i++) {
								let charData = rawValueArr[i];
								if (charData.char !== placeholderChar && charData.isNew === false) {
									break;
								}
								if (charData.char === placeholderChar) {
									indexOfNextAvailablePlaceholderChar = i;
									break;
								}
							}
							if (indexOfNextAvailablePlaceholderChar !== null) {
								conformedValue += rawValueChar;
								rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1);
							} else {
								i--;
							}
						}
						continue placeholderLoop;
					}
				}
			}
			if (supperssGuide === false) {
				conformedValue += placeholder.substr(i, placeholderLength);
			}
			break;
		} else {
			conformedValue += charInPlaceholder;
		}
	}
	if (supperssGuide && isAddition === false) {
		let indexOfLastFilledPlaceholderChar = null;
		for (let i = 0; i < conformedValue.length; i++) {
			if (placeholder[i] === placeholderChar) {
				indexOfLastFilledPlaceholderChar = i;
			}
		}
		if (indexOfLastFilledPlaceholderChar !== null) {
			conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1);
		} else {
			conformedValue = '';
		}
	}
	return {conformedValue, realValue};
}
