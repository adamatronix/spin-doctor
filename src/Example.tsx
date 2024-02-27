import { useCallback, useState, useRef } from 'react';
import useMeasure from 'react-use-measure';
import { useGesture } from '@use-gesture/react'
import { Coordinates } from './types';
import { find_angle, line_angle } from './findAngle';

export const Example = () => {
  const [ ref, bounds ] = useMeasure();
  const lastPosition = useRef<Coordinates|null>(null)
  const lastAngle = useRef<number|null>(null)
  const [ rotateVal, setRotateVal ] = useState<number>(0)
  const [ isDragging, setIsDragging ] = useState<boolean|null>(null);

  const calculateMouseLocation = useCallback((event:MouseEvent|PointerEvent|TouchEvent|KeyboardEvent) => {
    //@ts-expect-error clientX doesnt exist on possbile touch event
    const clientX = event.clientX || 0;
    //@ts-expect-error clientX doesnt exist on possbile touch event
    const clientY = event.clientY || 0;

    const x = (clientX - bounds.x) - (bounds.width / 2);
    const y = (clientY - bounds.y) - (bounds.height / 2);

    return {
      x: x,
      y: y
    }
  }, [bounds]);

  const getDirection = (a:Coordinates,b:Coordinates) => {
    let direction;
    const xDiff = b.x >= a.x ? 1 : -1;
    const yDiff = b.y >= a.y ? 1 : -1;


    const aAngle = line_angle({x:0,y:0},a)
    const bAngle = line_angle({x:0,y:0},b)
//weird fix here for when the user crosses over from the 4th quad to the 1st
    const angleDiff = aAngle > 0 && bAngle < 0 ? (aAngle * -1) - bAngle : bAngle - aAngle;
   

    if(angleDiff === 0) {
      return 0;
    }

   
    if(b.y >= 0 && b.x > 0) {
      if((xDiff >= 0 && angleDiff < 0) || (yDiff <= 0 && angleDiff < 0)) {
        // counter
        direction = -1;
      } else {
        direction = 1;
       
        //clockwise
      }
    } else if(b.y >= 0 && b.x < 0) {
      if((xDiff < 0 && angleDiff > 0) || (yDiff < 0 && angleDiff > 0) ) {
        // clockwise
        direction = 1;
      } else {
        // counter
        direction = -1;
      }
    } else if(b.y < 0 && b.x < 0) {
      if((xDiff >= 0 && angleDiff > 0) || (yDiff <= 0 && angleDiff > 0) ) {
        // clockwise
        direction = 1;
      } else {
        // counter
        direction = -1;
      }
    } else {
      if((xDiff >= 0 && angleDiff > 0) || (yDiff >= 0 && angleDiff > 0) ) {
        // clockwise
        direction = 1;
      } else {
        // counter
        direction = -1;
      }
    }

    return direction;

  }

  const bindDrag = useGesture(
    {
      onDrag: ({ down, movement: pos, offset, event }) => {
        let angle = null;

        if(lastPosition.current) {
          const newPos = calculateMouseLocation(event);
          const direction = getDirection(lastPosition.current,newPos);

          angle = find_angle(lastPosition.current, {x:0,y:0}, newPos) * direction;

          if(angle) {
            /*console.log('____')
            console.log('last:',lastPosition.current)
            console.log('new:',calculateMouseLocation(event))
            console.log('angle:', angle)
            console.log('____')*/

         
          }
          
        }
        
        lastPosition.current = calculateMouseLocation(event);
        
        

        if(angle) {
          const rotateValue = lastAngle.current ? lastAngle.current + angle : angle;
          lastAngle.current = rotateValue
          setRotateVal(rotateValue);
        }
        
          if(!isDragging && down) {
            setIsDragging(true);
          } else if(isDragging && !down) {
            lastPosition.current = null;
            setIsDragging(false);
          }
      },
    }
  )
  return (
    <div className="dummy-disc" ref={ref} style={{transform: `rotate(${rotateVal}deg)`}} {...bindDrag()}>
      <div className="dummy-disc__line">

      </div>
    </div>
  )
}