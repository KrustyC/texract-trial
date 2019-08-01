import textract from './Textract'

const params = {
  JobId: process.env.TEXTRACT_JOB_ID,
};

const getText = (cell, blocksMap) => {
  let text = ''
  if (!cell.hasOwnProperty('Relationships')) {
    return text;
  }

  cell.Relationships.forEach(({ Type, Ids }) => {
    if (Type === 'CHILD') {
      Ids.forEach(id => {
        const word = blocksMap[id]
        if (word.BlockType === 'WORD') {
          text = `${text} ${word['Text']}`
        }

        if (word.BlockType === 'SELECTION_ELEMENT' && word.SelectionStatus === 'SELECTED') {
          text = `${text}X`
        }
      })
    }
  })

  return text.trim();
}

const getAnalysis = () => new Promise((resolve, reject) => {
  textract.getDocumentAnalysis(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    const { Blocks } = data
    const blocksMap = Blocks.reduce((obj, block) => ({ ...obj, [block.Id]: block }), {})

    const table = Blocks.find(({ BlockType }) => BlockType === 'TABLE')
    const rows = []
    table.Relationships
      .filter(({ Type }) => Type === 'CHILD')
      .forEach(({ Ids }) => {
        Ids.forEach((id) =>  {
          const cell = blocksMap[id]
          if (cell.BlockType === 'CELL') {
            const { RowIndex, ColumnIndex } = cell

            const row = RowIndex - 1
            const column = ColumnIndex - 1
            if (!(row in rows)) {
              // create new row
              rows[row] = []
            }
            // get the text value
            rows[row][column] = getText(cell, blocksMap)
          }
        })
      })
    
    const headers = rows[0]
    const values = rows.slice(1)

    const students = values.map(student => headers.reduce((obj, header, i) => ({
        ...obj, [header]: student[i]
      }), {})
    )

    return resolve({ headers, students })
  });
});

export default getAnalysis