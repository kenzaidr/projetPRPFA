declare module '../components/ride/RideForm' {
  import { FC } from 'react';
  
  interface RideFormProps {
    rideId: number;
    onCancel: () => void;
  }
  
  const RideForm: FC<RideFormProps>;
  export default RideForm;
}

