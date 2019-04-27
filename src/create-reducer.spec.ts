import * as T from './type-helpers'; // type-tests global
import { ActionType } from './type-helpers';
import { createStandardAction } from './create-standard-action';
import { createReducer } from './create-reducer';
import { getType } from './get-type';

const add = createStandardAction('ADD')<number>();
const increment = createStandardAction('INCREMENT')();
const decrement = createStandardAction('DECREMENT')();
const actions = {
  add,
  increment,
  decrement,
};

declare module './type-helpers' {
  interface Types {
    RootAction: ActionType<typeof actions>;
  }
}

const initialState = 0;

// @dts-jest:group With Action Creators
{
  const reducerTest = createReducer(initialState);

  const counterReducer1 = reducerTest.handleAction(
    [add, increment],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap
  counterReducer1;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer2 = reducerTest
    .handleAction([add], (state, action) => state + action.payload)
    .handleAction([increment], (state, _) => state + 1);
  // @dts-jest:pass:snap
  counterReducer2;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer3 = reducerTest.handleAction(
    add,
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap
  counterReducer3;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => [ "ADD"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer4 = reducerTest.handleAction(
    increment,
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap
  counterReducer4;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        [getType(add)]: counterReducer3.handlers.ADD,
        [getType(increment)]: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        [getType(add)]: (state: any, action: any) => state + action.payload,
        [getType(increment)]: (state: any, _: any) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
  }
}

// @dts-jest:group With Action Types
{
  const reducerTest = createReducer(initialState);

  const counterReducer1 = reducerTest.handleAction(
    ['ADD', 'INCREMENT'],
    (state, action) => state + (action.type === 'ADD' ? action.payload : 1)
  );
  // @dts-jest:pass:snap
  counterReducer1;
  // @dts-jest:pass
  Object.keys({ ...counterReducer1.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer2 = reducerTest
    .handleAction(['ADD'], (state, action) => state + action.payload)
    .handleAction(['INCREMENT'], (state, _) => state + 1);
  // @dts-jest:pass:snap
  counterReducer2;
  // @dts-jest:pass
  Object.keys({ ...counterReducer2.handlers }); // => ["ADD", "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer3 = reducerTest.handleAction(
    'ADD',
    (state, action) => state + action.payload
  );
  // @dts-jest:pass:snap
  counterReducer3;
  // @dts-jest:pass
  Object.keys({ ...counterReducer3.handlers }); // => ["ADD"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  const counterReducer4 = reducerTest.handleAction(
    'INCREMENT',
    (state, _) => state + 1
  );
  // @dts-jest:pass:snap
  counterReducer4;
  // @dts-jest:pass
  Object.keys({ ...counterReducer4.handlers }); // => [ "INCREMENT"]
  // @dts-jest:pass
  Object.keys({ ...reducerTest.handlers }); // => []

  {
    [
      counterReducer1,
      counterReducer2,
      createReducer(initialState, {
        ADD: counterReducer3.handlers.ADD,
        INCREMENT: counterReducer4.handlers.INCREMENT,
      }),
      createReducer(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
      createReducer<number, ActionType<typeof actions>>(initialState, {
        ADD: (state, action) => state + action.payload,
        INCREMENT: (state, action) => state + 1,
      }),
    ].forEach(fn => {
      // @dts-jest:pass
      fn(0, {} as any); // => 0
      // @dts-jest:pass
      fn(0, increment()); // => 1
      // @dts-jest:pass
      fn(0, add(4)); // => 4
    });
  }
}

{
  type State = {
    foo: string;
  };

  const defaultState: State = {
    foo: '',
  };

  const actions2 = {
    foo1: createStandardAction('foo1')(),
    foo2: createStandardAction('foo2')(),
    foo3: createStandardAction('foo3')(),
    foo4: createStandardAction('foo4')(),
  };

  type Action = ActionType<typeof actions2>;

  const reducer = createReducer<State, Action>(defaultState)
    .handleAction(actions2.foo1, (state, action) => {
      return {
        ...state,
      };
    })
    .handleAction(actions2.foo2, (state, action) => {
      return {
        ...state,
      };
    })
    .handleAction(actions2.foo3, (state, action) => {
      return {
        ...state,
      };
    })
    .handleAction(actions2.foo4, (state, action) => {
      return {
        ...state,
      };
    });

  reducer(defaultState, actions2.foo1()); // error
  reducer(defaultState, actions2.foo2()); // error
  reducer(defaultState, actions2.foo3()); // ok
  reducer(defaultState, actions2.foo4()); // ok
}