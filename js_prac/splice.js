// 기존 배열
let arr = ['apple', 'banana', 'orange', 'grape'];

// 'orange' 뒤에 'kiwi'를 추가하려고 함
const indexToInsert = arr.indexOf('orange') + 1; // 'orange' 다음 인덱스
arr.splice(indexToInsert, 0, 'kiwi'); // splice를 사용하여 'kiwi' 추가

console.log(arr); // 결과 확인
