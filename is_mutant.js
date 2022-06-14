const functions = require('@google-cloud/functions-framework');
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
const COLLECTION_NAME = 'mutant';

exports.mutant = functions.http('mutant', async (req, res) => {
  const dna = req.body.dna;
  const dnaSave = await (
    firestore
    .collection(COLLECTION_NAME)
    .where('dna', '==', dna)
    .get()
  );

  if (!dnaSave.empty) {
    return dnaSave.forEach(doc => {
      return res.status(doc.data().isMutant ? 200 : 403).json({});
    });
  }

  const dnaIsMutant = isMutant(dna);
  return (
    firestore
    .collection(COLLECTION_NAME)
    .add({
      dna,
      isMutant: dnaIsMutant,
    })
    .then(doc => {
      if (dnaIsMutant) {
        return res.status(200).json({});
      }

      return res.status(403).json({});
    })
    .catch(err => {
      console.error(err);
    })
  );
});

exports.stats = functions.http('stats', async (req, res) => {
  const dnaSave = await (
    firestore
    .collection(COLLECTION_NAME)
    .get()
  );

  let dnaMutant = 0;
  let dnaHuman = 0;
  dnaSave.forEach(doc => {
    if (doc.data().isMutant) {
      dnaMutant++;
      return;
    }

    dnaHuman++
  });

  return res.status(200).json({
    count_mutant_dna: dnaMutant,
    count_human_dna: dnaHuman,
    ratio: ((dnaMutant / dnaHuman) || 0),
  });
});

function isMutant(dna) {
  let matrix = [];
  dna.forEach(element => {
    matrix.push(element.split(''));
  });
  const matrixLength = (matrix.length - 1);
  let mutantsFind = 0;
  let findsDiagonalRight = {};
  let findsDiagonalLeft = {};
  for (
    let matrixRowIterator = 0;
    matrixRowIterator <= matrixLength;
    matrixRowIterator++
  ) {
    let positionHorizontal = 0;
    let positionVertical = 0;
    for (
      let matrixColumnIterator = 0;
      matrixColumnIterator <= matrixLength;
      matrixColumnIterator++
    ) {
      if (
        positionHorizontal === 0 ||
        positionHorizontal < matrixColumnIterator
      ) {
        let sequenceHorizontal = true;
        for (let steps = 1; steps <= 3; steps++) {
          positionHorizontal++
          if (
            !matrix[matrixRowIterator][matrixColumnIterator + steps] ||
            (
              (
                matrix
                [matrixRowIterator]
                [matrixColumnIterator]
              ) !== (
                matrix
                [matrixRowIterator]
                [matrixColumnIterator + steps]
              )
            )
          ) {
            sequenceHorizontal = false;
            break
          }
        }

        if (sequenceHorizontal) {
          mutantsFind++;
          if (mutantsFind > 1) {
            return true;
          }
        }
      }

      if (
        positionVertical === 0 ||
        positionVertical < matrixColumnIterator
      ) {
        let sequenceVertical = true;
        for (let steps = 1; steps <= 3; steps++) {
          positionVertical++;
          if (
            !matrix[matrixColumnIterator + steps] ||
            (
              (
                matrix
                [matrixColumnIterator]
                [matrixRowIterator]
              ) !== (
                matrix
                [matrixColumnIterator + steps]
                [matrixRowIterator]
              )
            )
          ) {
            sequenceVertical = false;
            break
          }
        }

        if (sequenceVertical) {
          mutantsFind++;
          if (mutantsFind > 1) {
            return true;
          }
        }
      }

      let sequenceDiagonalRight = true;
      if (!findsDiagonalRight[matrixRowIterator + '.' + matrixColumnIterator]) {
        for (let steps = 1, stepsBase = 0; steps <= 3; steps++, stepsBase++) {
          if (
            !matrix[matrixRowIterator + steps] ||
            !matrix[matrixRowIterator + steps][matrixColumnIterator + steps] ||
            (
              (
                matrix
                [matrixRowIterator + stepsBase]
                [matrixColumnIterator + stepsBase]
              ) !== (
                matrix
                [matrixRowIterator + steps]
                [matrixColumnIterator + steps]
              )
            )
          ) {
            sequenceDiagonalRight = false;
            break
          }
          findsDiagonalRight[(matrixRowIterator + steps) + '.' + (matrixColumnIterator + steps)] = true;
        }

        if (sequenceDiagonalRight) {
          mutantsFind++;
          if (mutantsFind > 1) {
            return true;
          }
        }
      }

      let sequenceDiagonalLeft = true;
      if (!findsDiagonalLeft[matrixRowIterator + '.' + matrixColumnIterator]) {
        for (let steps = 1, stepsBase = 0; steps <= 3; steps++, stepsBase++) {
          if (
            !matrix[matrixRowIterator + steps] ||
            !matrix[matrixRowIterator + steps][matrixColumnIterator - steps] ||
            (
              (
                matrix
                [matrixRowIterator + stepsBase]
                [matrixColumnIterator - stepsBase]
              ) !== (
                matrix
                [matrixRowIterator + steps]
                [matrixColumnIterator - steps]
              )
            )
          ) {
            sequenceDiagonalLeft = false;
            break
          }
          findsDiagonalLeft[(matrixRowIterator + steps) + '.' + (matrixColumnIterator + steps)] = true;
        }

        if (sequenceDiagonalLeft) {
          mutantsFind++;
          if (mutantsFind > 1) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
