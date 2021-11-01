import { useContext } from 'react';
import { ReduxContext } from './Provider';

export default function useDispatch() {
  const store = useContext(ReduxContext);

  return store.dispatch;
}