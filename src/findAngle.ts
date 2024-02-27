import { Coordinates } from "./types";

export const find_angle = (A:Coordinates,B:Coordinates,C:Coordinates) => {
  const AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
  const BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
  const AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));

  const radians = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
  return radians*180/Math.PI;
}

export const line_angle = (A:Coordinates, B:Coordinates) => {
  return Math.atan2(B.y - A.y, B.x - B.y) * 180/Math.PI;
}