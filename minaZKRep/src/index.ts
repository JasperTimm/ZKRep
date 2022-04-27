import { Mina, Field, SmartContract, state, State, method, Poseidon, CircuitValue, prop, Bool, PrivateKey } from 'snarkyjs';

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

class ZKRep extends SmartContract {
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


// setup
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const account1 = Local.testAccounts[0].privateKey;

async function deploy() {
  const snappPrivkey = PrivateKey.random();
  let snappAddress = snappPrivkey.toPublicKey();

  let snapp = new ZKRep(snappAddress);
  let tx = Mina.transaction(account1, async () => {
    console.log('Deploying ZKRep...');
    snapp.deploy();
  });

  await tx.send().wait();
}

export { deploy };