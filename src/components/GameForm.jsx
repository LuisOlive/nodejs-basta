import { useCallback, useEffect, useMemo } from 'react'
import Button from './Button'
import Input from './Input'

export default function GameForm() {
  const calcSpan = useCallback(i => ((i + 1) % 3 ? '' : 'col-span-2'))
  return <div></div>
  // return (
  //   <div className="">
  //     <div
  //       className={`
  //       bg-${color}-500
  //       absolute inset-0 -translate-y-1/2
  //       h-24 w-24 pt-4
  //       text-white font-bold text-center text-6xl
  //       rounded-full mx-auto
  //       `}
  //     >
  //       {letter}
  //     </div>

  //     <form className="grid grid-cols-2 gap-4 mt-12">
  //       {categories.map((category, i) => (
  //         <Input onChange={setters[i]} className={span(i)} color={color} key={i}>
  //           {category}
  //         </Input>
  //       ))}

  //       <Button color={color} className="col-span-2">
  //         Enviar
  //       </Button>
  //     </form>

  //     {values}
  //   </div>
  // )
}
