// SonarSource Cognitive Complexity per function (white paper v1.7), plus nesting depth, else-if chain
// length and else-after-return. Named functions (declarations, methods, `const f = () =>`, `{ f: () => }`)
// are scored on their own from nesting 0, so a factory closure isn't one giant function. Anonymous inline
// functions (callbacks, array elements) count toward their parent at nesting +1, as Sonar scores them, so
// branches can't be hidden in lambdas.
import ts from "typescript";

const K = ts.SyntaxKind;
const isFn = (n) => (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isGetAccessor(n) || ts.isSetAccessor(n)) && !!n.body;
const isLoop = (n) => ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isForInStatement(n) || ts.isWhileStatement(n) || ts.isDoStatement(n);
const logical = (n) => ts.isBinaryExpression(n) && [K.AmpersandAmpersandToken, K.BarBarToken, K.QuestionQuestionToken].includes(n.operatorToken.kind);
const namesIt = (p) => !!p && (ts.isVariableDeclaration(p) || ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p));
// `addTask: withUndo((id) => …)` is a named method behind a wrapper, not an inline callback.
const named = (n) => !(ts.isArrowFunction(n) || ts.isFunctionExpression(n)) || namesIt(n.parent) ||
  (ts.isCallExpression(n.parent) && namesIt(n.parent.parent));
const exits = (s) => !!s && (ts.isReturnStatement(s) || ts.isThrowStatement(s) || ts.isContinueStatement(s) || ts.isBreakStatement(s) ||
  (ts.isBlock(s) && s.statements.length > 0 && exits(s.statements[s.statements.length - 1])));

/** Every function in a source: { name, line, cognitive, depth, chain, elseAfterReturn }. */
export function cognitive(file, text) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const out = [];
  const nameOf = (n) => n.name?.getText(sf) ?? (n.parent && (ts.isVariableDeclaration(n.parent) || ts.isPropertyAssignment(n.parent)) ? n.parent.name.getText(sf) : "(anonymous)");
  const score = (fn) => {
    const r = { name: nameOf(fn), line: sf.getLineAndCharacterOfPosition(fn.getStart()).line + 1, cognitive: 0, depth: 0, chain: 0, elseAfterReturn: 0 };
    // Logical operators: +1 per run of the same operator (a && b && c = 1; a && b || c = 2).
    const ops = (n, parentOp) => {
      if (ts.isParenthesizedExpression(n)) return ops(n.expression, undefined);
      if (!logical(n)) return;
      const op = n.operatorToken.kind;
      if (op !== parentOp) r.cognitive++;
      ops(n.left, op); ops(n.right, op);
    };
    const walk = (n, nest) => {
      if (isFn(n) && named(n)) { score(n); return; }
      if (isFn(n)) { walkKids(n.body, nest + 1); return; }
      if (ts.isIfStatement(n)) {
        r.cognitive += 1 + nest; r.depth = Math.max(r.depth, nest + 1);
        let chain = 1, cur = n;
        ops(n.expression); walkKids(n.expression, nest); walk(n.thenStatement, nest + 1);
        while (cur.elseStatement) {
          if (exits(cur.thenStatement)) r.elseAfterReturn++;
          const e = cur.elseStatement;
          r.cognitive++;
          if (ts.isIfStatement(e)) { chain++; ops(e.expression); walkKids(e.expression, nest); walk(e.thenStatement, nest + 1); cur = e; }
          else { walk(e, nest + 1); break; }
        }
        r.chain = Math.max(r.chain, chain);
        return;
      }
      if (ts.isConditionalExpression(n)) { r.cognitive += 1 + nest; ops(n.condition); walkKids(n.condition, nest); walk(n.whenTrue, nest + 1); walk(n.whenFalse, nest + 1); return; }
      if (ts.isSwitchStatement(n) || isLoop(n) || ts.isCatchClause(n)) {
        r.cognitive += 1 + nest; r.depth = Math.max(r.depth, nest + 1);
        if (ts.isSwitchStatement(n)) ops(n.expression);
        ts.forEachChild(n, (c) => walk(c, nest + 1));
        return;
      }
      if (logical(n) && !(n.parent && logical(n.parent))) ops(n);
      walkKids(n, nest);
    };
    const walkKids = (n, nest) => ts.forEachChild(n, (c) => walk(c, nest));
    walkKids(fn.body, 0);
    out.push(r);
  };
  const top = (n) => { if (isFn(n)) score(n); else ts.forEachChild(n, top); };
  top(sf);
  return out;
}
