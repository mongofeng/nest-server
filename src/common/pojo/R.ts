export class R<T> {
  /**
   * 业务错误码
   */
  private code: number;
  /**
   * 结果集
   */
  private data: T;
  /**
   * 描述
   */
  private msg: string;

  constructor(code: number, data: T, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  public static ok<T>(data: T): R<T> {
    return new R(0, data, '请求成功');
  }

  public static failed(msg: string) {
    return new R(0, null, msg);
  }
}
