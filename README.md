# Prueba Juan Pablo Arnedo

## Pasos para descubrir mutantes 😱

1. Debes tener un ADN que sea (NxN) y que solamente contenga (A,T,C,G)
2. Debes enviar este ADN a: https://us-central1-mercadolibre-353100.cloudfunctions.net/mutant, debe ser por `POST` y debe tener la siguiente estructura:
  {
    "dna": ["ATGCGA","CAGTGC","TTATBT","AGAAGG","CCCCTA","TCACTG"]
  }
3. Si es un mutante tendras un codigo 200 y podras decirle a Magneto, si es un humano normal tendras un codigo 403 y sera mejor desecharlo !

## Pasos para obtener estadisticas de los mutantes encontrados:

1. Cuando Magneto solicite la informacion de cuantos mutantes se han encontrado debes entrar a: https://us-central1-mercadolibre-353100.cloudfunctions.net/stats, aqui podras ver cuantos mutantes se han encontrado `count_mutant_dna`, cuantos humanos `count_human_dna` y la division de ambos para saber la relacion entre ellos `ratio`
2. Entregale rapido estos datos a Magneto, no lo queremos ver enojado :(

## Como obtuvimos estos datos 🤔

1. Use como lenguaje de programacion Javascript en NodeJs.
2. Cree una logica que valide la secuencia de ADN iterando la matriz obtenida, se valida de forma horizontal, de forma vertical, la diagonal izquierda y la diagonal derecha, valido los 4 campos segun el orden en que se busque hasta encontrar diferencia entre las letras, si existe diferencia se detiene y guarda la posicion en la que quedo para no volver a pasar por estas letras. Al encontrar mas de una secuencia de mutantes se retorna un verdadero y se guarda en la base de datos.
3. Se utilizo Google Cloud con Funtions para realizar las APIs.
4. Se guardo la informacion en Firestore (Por facilidad al usar Google Functions).
5. Se subieron las funciones con `gcloud` desde terminal (uso linux) y quedo listo para entregar
6. Realice una prueba con Mocha.
