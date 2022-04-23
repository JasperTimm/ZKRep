import { Field, SmartContract, state, State, method, Poseidon, CircuitValue, prop, Bool } from 'snarkyjs';

/**
 * 
 */

class ResultEvent extends CircuitValue {
  @prop resultId: Field;
  @prop result: Bool;
  
  constructor(resultId: Field, result: Bool) {
    super();
    this.resultId = resultId;
    this.result = result;
  }
}

export default class ZKRep extends SmartContract {
  @state(Field) rep = State<Field>();

  // initialization
  deploy() {
    super.deploy();
    this.rep.set(Field(0));
  }

  @method async incrementRep(currentRep: Field, incAmt: Field) {
    const rep = await this.rep.get();
    Poseidon.hash([currentRep]).assertEquals(rep);
    this.rep.set(Poseidon.hash([currentRep.add(incAmt)]));
  }
  
  @method async repGreaterThan(currentRep: Field, checkVal: Field, reqId: Field) {
    const rep = await this.rep.get();
    Poseidon.hash([currentRep]).assertEquals(rep);
    const result = currentRep.gt(checkVal);
    const event = new ResultEvent(reqId, result);
    this.emitEvent(event);
  }

}
