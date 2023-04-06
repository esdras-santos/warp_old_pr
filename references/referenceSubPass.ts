import { Expression, DataLocation, ASTNode } from 'solc-typed-ast';
import { AST } from '../../ast/ast';
import { ASTMapper } from '../../ast/mapper';

/*
 A common superclass for passes utilising the data generated by the internal analyses of this pass
 Replace is particularly important, as new nodes inserted into the tree don't have analysis data
 associated by default
*/
export class ReferenceSubPass extends ASTMapper {
  constructor(
    protected actualDataLocations: Map<Expression, DataLocation>,
    protected expectedDataLocations: Map<Expression, DataLocation>,
  ) {
    super();
  }

  protected getLocations(
    node: Expression,
  ): [actual: DataLocation | undefined, expected: DataLocation | undefined] {
    return [this.actualDataLocations.get(node), this.expectedDataLocations.get(node)];
  }

  protected replace(
    oldNode: Expression,
    newNode: Expression,
    parent: ASTNode | undefined,
    actualLoc: DataLocation | undefined,
    expectedLoc: DataLocation | undefined,
    ast: AST,
  ): void {
    ast.replaceNode(oldNode, newNode, parent);
    if (actualLoc) {
      this.actualDataLocations.set(newNode, actualLoc);
    }
    if (expectedLoc) {
      this.expectedDataLocations.set(newNode, expectedLoc);
    }
  }
}
