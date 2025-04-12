declare namespace ApiType {
  namespace Page {
    type Param = {
      page: number
      pageSize: number
    }

    type Result<T> = {
      records: T[]
      total: number
    }
  }

  namespace Auth {
    type Login = {
      phone: string
      password: string
    }

    type UserClaim = {
      accessToken: string
      refreshToken: string
      expireIn: number
      tokenTime: number
    }

    type Info = User.Info & {}

    type Refresh = {
      refreshToken: string
    }
  }

  // * 租户
  namespace Tenant {
    type Info = {
      id: number,
      userId: number,
      name: string,
      account: string,
      password: string,
      p12Cert: string,
      p12CertPassword: string
      mobileProvision: string
      provisionBundleId: string,
      p12Expiry: string,
      provisionExpiry: string,
      createdAt: Date
      updatedAt: Date
    }

    type Search = {
      name?: string
      tsStart?: string
      tsEnd?: string
    } & Page.Param
  }

  // * 用户
  namespace User {
    type Info = {
      id: number
      tenant_id: number
      account: string
      is_root: boolean
      tenant_name: string
      provision_bundle_id: string
    }
    type Search = {
      account?: string
    }

    type UpdatePassword = {
      id: number;
      newPassword: string
    }
  }
  //签名列表
  namespace Sign {
    type info = {
      id: number
      bundle_id: string
      bundle_name: string
      created_at: string
      tenant_id: number
    }

    type IpaInfo = {
      id: string
      bundleId: string
      bundleName: string
      bundleVersion: string
      bundleVersion: string
    }

    type Operate = {
      id: string
      p12Password: string
      bundleId: string
      bundleName: string
      bundleVersion: string
    }

    type Search = {
      tenantId: number
      tsStart?: string
      tsEnd?: string
    } & Page.Param
  }

  //登录日志
  namespace LoginLog {
    type Info = {
      id: number,
      tenantId: number,
      account: string,
      clientIp: string,
      clientAddress: string,
      createdAt: Date,
    }

    type Search = {
      name?: string
      tsStart?: string
      tsEnd?: string
    } & Page.Param
  }

  //返回值
  namespace Response {
    type Res<T> = {
      code: number;
      data: T;
      message: string;
      success: boolean;
    }
  }
}
