import { useSpinDoctor } from "./SpinDoctor"

export const Example = () => {
  const [ref,bindDrag,rotateVal] = useSpinDoctor();
  
  return (
    <div className="dummy-disc" ref={ref} style={{transform: `rotate(${rotateVal}deg)`}} {...bindDrag()}>
      <div className="dummy-disc__line">

      </div>
    </div>
  )
}